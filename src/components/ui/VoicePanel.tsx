import React from 'react';
import { AlertCircle, Mic, MicOff, Volume2, X } from 'lucide-react';
import type { VoiceState } from '../../types';
import { cn } from '../../utils/cn';

interface VoicePanelProps {
  voiceState: VoiceState;
  transcript: string;
  voiceMessage: string;
  isSupported: boolean;
  onToggleListening: () => void;
  onDismiss: () => void;
}

const STATE_CONFIG: Record<
  VoiceState,
  {
    label: string;
    sublabel: string;
    ringColor: string;
    bgColor: string;
    iconColor: string;
  }
> = {
  idle: {
    label: 'Voice Ready',
    sublabel: 'Tap the mic to speak',
    ringColor: 'ring-white/20',
    bgColor: 'bg-white/10',
    iconColor: 'text-white/70',
  },
  listening: {
    label: 'Listening...',
    sublabel: 'Speak now - I am listening',
    ringColor: 'ring-red-400/60',
    bgColor: 'bg-red-500/20',
    iconColor: 'text-red-400',
  },
  processing: {
    label: 'Processing...',
    sublabel: 'Understanding your command',
    ringColor: 'ring-amber-400/60',
    bgColor: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  speaking: {
    label: 'Speaking...',
    sublabel: 'Playing voice response',
    ringColor: 'ring-blue-400/60',
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
};

const WAVE_BARS = [
  { delay: '0s', height: '28px' },
  { delay: '0.1s', height: '20px' },
  { delay: '0.2s', height: '32px' },
  { delay: '0.15s', height: '16px' },
  { delay: '0.05s', height: '24px' },
  { delay: '0.25s', height: '20px' },
  { delay: '0.1s', height: '28px' },
  { delay: '0.3s', height: '12px' },
  { delay: '0.2s', height: '22px' },
  { delay: '0.05s', height: '18px' },
];

const SUGGESTIONS = [
  { cmd: '"Show me restaurants"', icon: '🍴' },
  { cmd: '"Find museums"', icon: '🏛' },
  { cmd: '"How do I get around?"', icon: '🚇' },
  { cmd: '"Help"', icon: '?' },
];

const WaveBar: React.FC<{ delay: string; height: string; active: boolean }> = ({
  delay,
  height,
  active,
}) => (
  <span
    className={cn(
      'w-1 rounded-full transition-all duration-300',
      active ? 'bg-red-400' : 'bg-white/20'
    )}
    style={{
      height: active ? height : '4px',
      animation: active ? 'voiceWave 0.8s ease-in-out infinite alternate' : 'none',
      animationDelay: delay,
    }}
  />
);

export const VoicePanel: React.FC<VoicePanelProps> = ({
  voiceState,
  transcript,
  voiceMessage,
  isSupported,
  onToggleListening,
  onDismiss,
}) => {
  const config = STATE_CONFIG[voiceState];
  const isActive = voiceState === 'listening' || voiceState === 'processing';
  const showHelpSuggestions =
    (voiceMessage === 'help' || voiceState === 'idle') && !transcript;

  if (!isSupported) {
    return (
      <div
        className="fixed bottom-6 right-6 z-40 w-80 rounded-3xl border-2 border-red-400/30
          bg-slate-900/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <AlertCircle size={24} className="shrink-0 text-red-400" />
          <div>
            <p className="font-bold text-white">Voice Not Supported</p>
            <p className="text-sm text-white/50">
              Please use Chrome or Edge browser for voice features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes voiceWave {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>

      <div
        className={cn(
          'fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-[24rem] rounded-3xl border-2',
          'bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300',
          'sm:bottom-6 sm:right-6 sm:w-96',
          isActive ? 'border-red-400/40' : 'border-white/10'
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                voiceState === 'idle' && 'bg-white/30',
                voiceState === 'listening' && 'bg-red-400 animate-pulse',
                voiceState === 'processing' && 'bg-amber-400 animate-pulse',
                voiceState === 'speaking' && 'bg-blue-400 animate-pulse'
              )}
            />
            <p className="text-base font-bold text-white">{config.label}</p>
          </div>

          <button
            onClick={onDismiss}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/8 transition-colors hover:bg-white/15"
            aria-label="Dismiss voice panel"
          >
            <X size={14} className="text-white/50" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-5">
            <button
              onClick={onToggleListening}
              aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
              aria-live="polite"
              className={cn(
                'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 ring-4',
                'transition-all duration-300 active:scale-95 focus:outline-none',
                config.ringColor,
                config.bgColor
              )}
            >
              {voiceState === 'listening' ? (
                <MicOff size={26} className="text-red-400" />
              ) : voiceState === 'speaking' ? (
                <Volume2 size={26} className={config.iconColor} />
              ) : (
                <Mic size={26} className={config.iconColor} />
              )}

              {voiceState === 'listening' && (
                <span
                  className="absolute -inset-2 rounded-[20px] border-2 border-red-400/30 animate-ping"
                  style={{ animationDuration: '1.5s' }}
                />
              )}
            </button>

            <div className="flex flex-1 flex-col gap-2">
              <p className="text-xs text-white/50">{config.sublabel}</p>
              <div className="flex h-8 items-center gap-1">
                {WAVE_BARS.map(({ delay, height }, index) => (
                  <WaveBar
                    key={`${delay}-${height}-${index}`}
                    delay={delay}
                    height={height}
                    active={voiceState === 'listening'}
                  />
                ))}
              </div>
            </div>
          </div>

          {transcript && (
            <div className="min-h-[52px] rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                I heard:
              </p>
              <p className="text-sm font-medium leading-relaxed text-white">"{transcript}"</p>
            </div>
          )}

          {voiceMessage && voiceMessage !== 'help' && (
            <div
              className="flex items-start gap-3 rounded-2xl border border-blue-400/20
                bg-blue-500/10 px-4 py-3"
            >
              <Volume2 size={16} className="mt-0.5 shrink-0 text-blue-400" />
              <p className="text-sm leading-relaxed text-blue-200">{voiceMessage}</p>
            </div>
          )}

          {showHelpSuggestions && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
                Try saying...
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTIONS.map(({ cmd, icon }) => (
                  <div
                    key={cmd}
                    className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5"
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-sm font-medium text-white/55">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {voiceState === 'idle' && (
            <button
              onClick={onToggleListening}
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl
                bg-gradient-to-r from-red-500 to-rose-500 text-base font-bold text-white
                shadow-lg shadow-red-500/25 transition-all duration-200 active:scale-[0.98]
                hover:from-red-400 hover:to-rose-400"
            >
              <Mic size={20} />
              Tap to Speak
            </button>
          )}

          {voiceState === 'listening' && (
            <button
              onClick={onToggleListening}
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl
                border-2 border-red-400/50 bg-red-500/20 text-base font-bold text-red-300
                transition-all duration-200 active:scale-[0.98] hover:bg-red-500/30"
            >
              <MicOff size={20} />
              Stop Listening
            </button>
          )}
        </div>
      </div>
    </>
  );
};
