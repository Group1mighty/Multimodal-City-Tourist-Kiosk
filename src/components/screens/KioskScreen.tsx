import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Mic, ChevronDown } from 'lucide-react';
import type { Category, Location, VoiceState } from '../../types';
import { locations, CATEGORY_META, searchLocations } from '../../data/locations';
import { CategorySidebar } from '../ui/CategorySidebar';
import { LocationCard } from '../ui/LocationCard';
import { SearchBar } from '../ui/SearchBar';
import { VoicePanel } from '../ui/VoicePanel';
import { LocationDetail } from '../ui/LocationDetail';
import { TopBar } from '../ui/TopBar';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { processVoiceCommand } from '../../utils/voiceCommands';
import { cn } from '../../utils/cn';

// ── Voice Mode Helpers ────────────────────────────────────────────────────────

type VoiceMode = 'search' | 'choosing' | 'post-detail' | null;

const NUMBER_WORDS: Record<string, number> = {
  one: 1, first: 1,
  two: 2, second: 2,
  three: 3, third: 3,
  four: 4, fourth: 4,
  five: 5, fifth: 5,
};

function buildOptionsScript(locs: Location[]): string {
  if (locs.length === 0)
    return "I didn't find any matching locations. Please try again with a different search.";
  if (locs.length === 1)
    return `I found one option: ${locs[0].name}. ${locs[0].shortDesc}. Say yes to open it, or say back to search again.`;
  const top = locs.slice(0, 5);
  const nameList = top.map((l, i) => `${i + 1}. ${l.name}`).join('. ');
  const suffix = locs.length > 5 ? ` Showing the top ${top.length} of ${locs.length} results.` : '';
  return `I found ${top.length} options: ${nameList}.${suffix} Which one would you like? Say the name or a number.`;
}

function buildDetailScript(loc: Location): string {
  const price = loc.priceRange ? ` Price range: ${loc.priceRange}.` : '';
  const phone = loc.phone ? ` You can reach them at ${loc.phone}.` : '';
  return (
    `${loc.name}. ${loc.description} ` +
    `Located at ${loc.address}. ` +
    `Open: ${loc.openHours}. ` +
    `Distance from here: ${loc.distance}.${price}${phone}`
  );
}

const POST_DETAIL_PROMPT =
  'Would you like to choose another option? Say a number or name to hear more details, or say finish to start a new search.';

function matchLocationChoice(transcript: string, locs: Location[]): Location | null {
  const t = transcript.toLowerCase().trim();

  if (locs.length === 1 && /\b(yes|ok|okay|sure|open|show|that one)\b/.test(t))
    return locs[0];

  for (const [word, num] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(t) && num <= locs.length)
      return locs[num - 1];
  }

  const digitMatch = t.match(/\b([1-5])\b/);
  if (digitMatch) {
    const idx = parseInt(digitMatch[1]) - 1;
    if (idx >= 0 && idx < locs.length) return locs[idx];
  }

  for (const loc of locs) {
    const nameLower = loc.name.toLowerCase();
    if (t.includes(nameLower)) return loc;
    const words = nameLower.split(' ').filter(w => w.length > 3);
    if (words.length > 0 && words.some(w => t.includes(w))) return loc;
  }

  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface KioskScreenProps {
  onIdle?: () => void;
  autoStartVoice?: boolean;
  onResetIdleTimer?: () => void;
}

export const KioskScreen: React.FC<KioskScreenProps> = ({
  autoStartVoice = false,
  onResetIdleTimer,
}) => {
  // ── State ────────────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [showVoicePanel, setShowVoicePanel] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedLocationIds, setSavedLocationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Refs ──────────────────────────────────────────────────────────────────
  const voiceModeRef = useRef<VoiceMode>(null);
  const voiceResultsRef = useRef<Location[]>([]);
  const startRecognitionRef = useRef<() => void>(() => {});
  const onTranscriptRef = useRef<(t: string, isFinal: boolean) => void>(() => {});
  const onResetIdleRef = useRef(onResetIdleTimer);
  onResetIdleRef.current = onResetIdleTimer;

  // ── Hooks ────────────────────────────────────────────────────────────────
  const { playTap, playVoiceStart, playVoiceStop, playSuccess } = useSoundEffects();
  const { speak, cancel: cancelSpeech } = useSpeechSynthesis({ rate: 0.92 });

  // Reset idle timer on every voice state change so TTS/listening never times out
  useEffect(() => {
    if (autoStartVoice && voiceState !== 'idle') {
      onResetIdleRef.current?.();
    }
  }, [voiceState, autoStartVoice]);

  const handleVoiceEnd = useCallback(() => {
    if (voiceState === 'listening') {
      setVoiceState('idle');
      playVoiceStop();
    }
  }, [voiceState, playVoiceStop]);

  const handleVoiceError = useCallback((error: string) => {
    setVoiceMessage(error);
    setVoiceState('idle');
    playVoiceStop();
  }, [playVoiceStop]);

  const stableOnTranscript = useCallback(
    (t: string, isFinal: boolean) => onTranscriptRef.current(t, isFinal),
    []
  );

  const { start: startRecognition, stop: stopRecognition, isSupported } =
    useSpeechRecognition({
      onTranscript: stableOnTranscript,
      onEnd: handleVoiceEnd,
      onError: handleVoiceError,
    });

  startRecognitionRef.current = startRecognition;

  // ── Shared helper: read a location detail then offer post-detail loop ─────
  const readDetailThenLoop = useCallback(
    (loc: Location) => {
      setSelectedLocation(loc);
      setVoiceState('speaking');
      setVoiceMessage(`Opening ${loc.name}`);
      const script = buildDetailScript(loc);
      speak(script, {
        onEnd: () => {
          // Close the detail modal immediately after finishing the details
          setSelectedLocation(null);

          // After reading details, offer another choice
          setVoiceState('speaking');
          setVoiceMessage(POST_DETAIL_PROMPT);
          speak(POST_DETAIL_PROMPT, {
            onEnd: () => {
              voiceModeRef.current = 'post-detail';
              setVoiceState('listening');
              startRecognitionRef.current();
              playVoiceStart();
            },
            onError: () => setVoiceState('idle'),
          });
        },
        onError: () => setVoiceState('idle'),
      });
      playSuccess();
    },
    [speak, playSuccess, playVoiceStart]
  );

  // ── Voice transcript handler ──────────────────────────────────────────────
  const handleVoiceTranscript = useCallback(
    (transcript: string, isFinal: boolean) => {
      setLiveTranscript(transcript);
      if (!isFinal) return;

      setVoiceState('processing');
      onResetIdleRef.current?.();

      setTimeout(() => {
        const mode = voiceModeRef.current;

        // ── POST-DETAIL: user can pick another or say finish ─────────────────
        if (mode === 'post-detail') {
          const t = transcript.toLowerCase().trim();

          if (/\b(finish|done|stop|exit|quit|no|goodbye|bye|new search|search again)\b/.test(t)) {
            // Return to initial search listening
            voiceModeRef.current = 'search';
            const prompt = "What would you like to explore? Say a category like food, attractions, or transport, or describe what you're looking for.";
            setVoiceState('speaking');
            setVoiceMessage(prompt);
            speak(prompt, {
              onEnd: () => {
                setVoiceState('listening');
                startRecognitionRef.current();
                playVoiceStart();
              },
              onError: () => setVoiceState('idle'),
            });
            return;
          }

          const matched = matchLocationChoice(transcript, voiceResultsRef.current);
          if (matched) {
            readDetailThenLoop(matched);
            return;
          }

          // Could not match
          const retry = "Sorry, I didn't catch that. Say a number or name from the list, or say finish to start over.";
          setVoiceState('speaking');
          setVoiceMessage(retry);
          speak(retry, {
            onEnd: () => {
              voiceModeRef.current = 'post-detail';
              setVoiceState('listening');
              startRecognitionRef.current();
              playVoiceStart();
            },
            onError: () => setVoiceState('idle'),
          });
          return;
        }

        // ── CHOOSING: user picks from the read-out list ──────────────────────
        if (mode === 'choosing') {
          const matched = matchLocationChoice(transcript, voiceResultsRef.current);
          if (matched) {
            readDetailThenLoop(matched);
            return;
          }

          const retry = "Sorry, I didn't catch that. Please say the name or number of your choice.";
          setVoiceState('speaking');
          setVoiceMessage(retry);
          speak(retry, {
            onEnd: () => {
              setVoiceState('listening');
              startRecognitionRef.current();
              playVoiceStart();
            },
            onError: () => setVoiceState('idle'),
          });
          return;
        }

        // ── SEARCH: initial query (or post-finish new search) ────────────────
        const command = processVoiceCommand(transcript);
        if (!command) { setVoiceState('idle'); return; }

        const action = command.action;
        let matchedLocations: Location[] = [];

        if (action.type === 'SET_CATEGORY') {
          setActiveCategory(action.payload as Category);
          matchedLocations = action.payload === 'All'
            ? locations
            : locations.filter(l => l.category === action.payload);
        }
        if (action.type === 'SET_SEARCH') {
          setSearchQuery(action.payload as string);
          setActiveCategory('All');
          matchedLocations = searchLocations(action.payload as string);
        }
        if (action.type === 'SELECT_LOCATION') setSelectedLocation(action.payload as Location | null);
        if (action.type === 'SET_VOICE_MESSAGE') setVoiceMessage(action.payload as string);

        // ── Voice-driven mode: read options → listen for choice ───────────────
        if (
          autoStartVoice &&
          matchedLocations.length > 0 &&
          (action.type === 'SET_CATEGORY' || action.type === 'SET_SEARCH')
        ) {
          voiceResultsRef.current = matchedLocations.slice(0, 5);
          // Combine original feedback with the options reading
          const script = `${command.feedback} ${buildOptionsScript(voiceResultsRef.current)}`;
          setVoiceState('speaking');
          setVoiceMessage(script);
          speak(script, {
            onEnd: () => {
              voiceModeRef.current = 'choosing';
              setVoiceState('listening');
              startRecognitionRef.current();
              playVoiceStart();
            },
            onError: () => setVoiceState('idle'),
          });
          playSuccess();
          return;
        }

        // Normal touch mode
        setVoiceState('speaking');
        setVoiceMessage(command.feedback);
        speak(command.feedback, {
          onEnd: () => setVoiceState('idle'),
          onError: () => setVoiceState('idle'),
        });
        playSuccess();
      }, 400);
    },
    [speak, playSuccess, playVoiceStart, autoStartVoice, readDetailThenLoop]
  );

  onTranscriptRef.current = handleVoiceTranscript;

  // ── Auto-start voice on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!autoStartVoice) return;
    voiceModeRef.current = 'search';
    const timer = setTimeout(() => {
      setShowVoicePanel(true);
      cancelSpeech();
      setLiveTranscript('');
      
      const greeting = "I am listening. What would you like to explore?";
      setVoiceState('speaking');
      setVoiceMessage(greeting);
      speak(greeting, {
        onEnd: () => {
          setVoiceState('listening');
          startRecognitionRef.current();
          playVoiceStart();
        },
        onError: () => {
          setVoiceState('idle');
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Clock ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Filtered locations ───────────────────────────────────────────────────
  const filteredLocations = useMemo(() => {
    let result = [...locations];
    if (activeCategory !== 'All') result = result.filter(l => l.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.shortDesc.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.subCategory.toLowerCase().includes(q) ||
          l.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const featuredLocations = useMemo(
    () => filteredLocations.filter(l => l.featured || savedLocationIds.includes(l.id)),
    [filteredLocations, savedLocationIds]
  );
  const regularLocations = useMemo(
    () =>
      activeCategory === 'All' && !searchQuery
        ? filteredLocations.filter(l => !l.featured && !savedLocationIds.includes(l.id))
        : filteredLocations,
    [filteredLocations, activeCategory, searchQuery, savedLocationIds]
  );

  // ── Manual voice toggle ───────────────────────────────────────────────────
  const handleToggleListening = useCallback(() => {
    if (voiceState === 'listening') {
      stopRecognition();
      setVoiceState('idle');
      playVoiceStop();
      voiceModeRef.current = null;
    } else if (voiceState === 'idle') {
      cancelSpeech();
      setLiveTranscript('');
      setVoiceMessage('');
      startRecognition();
      setVoiceState('listening');
      playVoiceStart();
    }
  }, [voiceState, startRecognition, stopRecognition, cancelSpeech, playVoiceStart, playVoiceStop]);

  const handleTap = useCallback(() => { playTap(); }, [playTap]);

  const handleReadAloud = useCallback(
    (text: string) => {
      setVoiceState('speaking');
      setShowVoicePanel(true);
      speak(text, {
        onEnd: () => setVoiceState('idle'),
        onError: () => setVoiceState('idle'),
      });
    },
    [speak]
  );

  const activeMeta = CATEGORY_META[activeCategory];

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden text-base">
      <TopBar 
        currentTime={currentTime} 
        city="Nova Crest" 
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay for mobile when sidebar is open */}
        {isMobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        
        <CategorySidebar 
          activeCategory={activeCategory} 
          onSelect={(cat) => {
            setActiveCategory(cat);
            setIsMobileMenuOpen(false);
          }} 
          onTap={handleTap} 
          className={cn(
            "absolute top-0 left-0 h-full md:static md:h-auto z-30 transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-4 md:px-6 pt-4 pb-3 md:pt-5 md:pb-4 space-y-4 bg-slate-950/80 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <span className="text-3xl shrink-0">{activeMeta.icon}</span>
                <div className="min-w-0">
                  <h2 className="text-white font-black text-2xl leading-none truncate">
                    {activeCategory === 'All' ? 'Explore Nova Crest' : activeCategory}
                  </h2>
                  <p className="text-white/40 text-sm mt-0.5">
                    {searchQuery
                      ? `${filteredLocations.length} results for "${searchQuery}"`
                      : activeMeta.description}
                  </p>
                </div>
              </div>
              {!showVoicePanel && (
                <button
                  onClick={() => { handleTap(); setShowVoicePanel(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-400/30 text-red-400 hover:bg-red-500/25 transition-colors"
                >
                  <Mic size={16} />
                  <span className="text-sm font-semibold">Voice</span>
                </button>
              )}
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
          >
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} onTap={handleTap} resultCount={filteredLocations.length} />
            </div>

            {filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <span className="text-7xl opacity-30">🔍</span>
                <p className="text-white/40 text-xl font-semibold">No results found</p>
                <p className="text-white/25 text-base">Try a different search or category</p>
                <button
                  onClick={() => { handleTap(); setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeCategory === 'All' && !searchQuery && featuredLocations.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-amber-400 text-lg">⭐</span>
                      <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest">Featured</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {featuredLocations.map(loc => (
                        <LocationCard key={loc.id} location={loc} onSelect={setSelectedLocation} onTap={handleTap} featured />
                      ))}
                    </div>
                  </section>
                )}

                {activeCategory === 'All' && regularLocations.length > 0 && (
                  <section>
                    {!searchQuery && (
                      <div className="flex items-center gap-2 mb-3">
                        <ChevronDown size={16} className="text-white/40" />
                        <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest">All Locations</h3>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {regularLocations.map(loc => (
                        <LocationCard key={loc.id} location={loc} onSelect={setSelectedLocation} onTap={handleTap} featured={loc.featured} />
                      ))}
                    </div>
                  </section>
                )}

                {activeCategory !== 'All' && filteredLocations.length > 0 && (
                  <section>
                    <div className={cn('flex items-center gap-2 mb-3')}>
                      <span className="text-lg">{activeMeta.icon}</span>
                      <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest">
                        {filteredLocations.length} {activeCategory} {filteredLocations.length === 1 ? 'Location' : 'Locations'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredLocations.map(loc => (
                        <LocationCard key={loc.id} location={loc} onSelect={setSelectedLocation} onTap={handleTap} featured={loc.featured} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showVoicePanel && (
        <VoicePanel
          voiceState={voiceState}
          transcript={liveTranscript}
          voiceMessage={voiceMessage}
          isSupported={isSupported}
          onToggleListening={handleToggleListening}
          onDismiss={() => {
            handleTap();
            setShowVoicePanel(false);
            voiceModeRef.current = null;
            if (voiceState === 'listening') {
              stopRecognition();
              setVoiceState('idle');
            }
          }}
        />
      )}

      {!showVoicePanel && (
        <button
          onClick={() => { handleTap(); setShowVoicePanel(true); }}
          aria-label="Open voice assistant"
          className={cn(
            'fixed bottom-6 right-6 z-40 w-16 h-16 rounded-2xl shadow-2xl shadow-black/50',
            'flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600',
            'border-2 border-red-400/40 transition-all duration-200 active:scale-95 ring-4 ring-red-400/20'
          )}
        >
          <Mic size={26} className="text-white" />
        </button>
      )}

      {selectedLocation && (
        <LocationDetail
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onTap={handleTap}
          onSpeak={handleReadAloud}
          onSaveChange={(id, isSaved) => {
            setSavedLocationIds(prev =>
              isSaved ? [...prev, id] : prev.filter(savedId => savedId !== id)
            );
          }}
        />
      )}
    </div>
  );
};
