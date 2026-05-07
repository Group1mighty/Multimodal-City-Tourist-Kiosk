import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle, X } from 'lucide-react';
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

const STATE_CONFIG: Record<VoiceState, {
  label: string;
  sublabel: string;
  ringColor: string;
  bgColor: string;
  iconColor: string;
  pulseClass: string;
}> = {
  idle: {
    label: 'Voice Ready',
    sublabel: 'Tap the mic to speak',
    ringColor: 'ring-white/20',
    bgColor: 'bg-white/10',
    iconColor: 'text-white/70',
    pulseClass: '',
  },
  listening: {
    label: 'Listening…',
    sublabel: 'Speak now — I am listening',
    ringColor: 'ring-red-400/60',
    bgColor: 'bg-red-500/20',
    iconColor: 'text-red-400',
    pulseClass: 'animate-pulse',
  },
  processing: {
    label: 'Processing…',
    sublabel: 'Understanding your command',
    ringColor: 'ring-amber-400/60',
    bgColor: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    pulseClass: 'animate-spin',
  },
  speaking: {
    label: 'Speaking…',
    sublabel: 'Playing voice response',
    ringColor: 'ring-blue-400/60',
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    pulseClass: '',
  },
};

// ── Voice waveform bars animation ─────────────────────────────────────────────
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
      animation: active ? voiceWave 0.8s ease-in-out infinite alternate : 'none',
      animationDelay: delay,
    }}
  />
);

// Voice command suggestions
const SUGGESTIONS = [
  { cmd: '"Show me restaurants"', icon: '🍴' },
  { cmd: '"Find museums"', icon: '🏛' },
  { cmd: '"How do I get around?"', icon: '🚇' },
  { cmd: '"Help"', icon: '❓' },
];
export const VoicePanel: React.FC<VoicePanelProps> = ({
  voiceState,
  transcript,
  voiceMessage,
  isSupported,
  onToggleListening,
  onDismiss,
}) => {
  const config = STATE_CONFIG[voiceState];
  const isActive = voiceState === 'listening'  voiceState === 'processing';

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-40 w-80
        bg-slate-900/95 backdrop-blur-xl border-2 border-red-400/30 rounded-3xl
        p-5 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3">
          <AlertCircle size={24} className="text-red-400 shrink-0" />
          <div>
            <p className="text-white font-bold">Voice Not Supported</p>
            <p className="text-white/50 text-sm">
              Please use Chrome or Edge browser for voice features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Inline style for wave animation */}
      <style>{`
        @keyframes voiceWave {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* Voice panel — fixed bottom-right */}
      <div className={cn(
        'fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] max-w-[24rem] sm:w-96',
        'bg-slate-900/95 backdrop-blur-xl',
        'border-2 rounded-3xl shadow-2xl shadow-black/50',
        'transition-all duration-300',
        isActive ? 'border-red-400/40' : 'border-white/10'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4
          border-b border-white/8">
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <span className={cn(
              'w-2.5 h-2.5 rounded-full',
              voiceState === 'idle'       && 'bg-white/30',
              voiceState === 'listening'  && 'bg-red-400 animate-pulse',
              voiceState === 'processing' && 'bg-amber-400 animate-pulse',
              voiceState === 'speaking'   && 'bg-blue-400 animate-pulse',
            )} />
            <p className="text-white font-bold text-base">{config.label}</p>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15
              flex items-center justify-center transition-colors"
            aria-label="Dismiss voice panel"
          >
            <X size={14} className="text-white/50" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Main mic button + waveform */}
          <div className="flex items-center gap-5">
            {/* Mic button */}
            <button
              onClick={onToggleListening}
              aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
              aria-live="polite"
              className={cn(
                'relative shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center',
                'border-2 ring-4 transition-all duration-300 active:scale-95',
                config.ringColor, config.bgColor,
                'focus:outline-none'
              )}
            >
              {voiceState === 'listening' ? (
                <MicOff size={26} className="text-red-400" />
              ) : voiceState === 'speaking' ? (
                <Volume2 size={26} className={config.iconColor} />
              ) : (
                <Mic size={26} className={config.iconColor} />
              )}

              {/* Outer pulse ring for listening state */}
              {voiceState === 'listening' && (
                <span className="absolute -inset-2 rounded-[20px] border-2 border-red-400/30
                  animate-ping" style={{ animationDuration: '1.5s' }} />
              )}
            </button>

            {/* Waveform visualiser */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-white/50 text-xs">{config.sublabel}</p>
              <div className="flex items-center gap-1 h-8">
                {[
{ delay: '0s',     height: '28px' },
                  { delay: '0.1s',   height: '20px' },
                  { delay: '0.2s',   height: '32px' },
                  { delay: '0.15s',  height: '16px' },
                  { delay: '0.05s',  height: '24px' },
                  { delay: '0.25s',  height: '20px' },
                  { delay: '0.1s',   height: '28px' },
                  { delay: '0.3s',   height: '12px' },
                  { delay: '0.2s',   height: '22px' },
                  { delay: '0.05s',  height: '18px' },
                ].map(({ delay, height }, i) => (
                  <WaveBar
                    key={i}
                    delay={delay}
                    height={height}
                    active={voiceState === 'listening'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Transcript display */}
          {transcript && (
            <div className="px-4 py-3 rounded-2xl bg-white/6 border border-white/10
              min-h-[52px]">
              <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-semibold">
                I heard:
              </p>
              <p className="text-white font-medium text-sm leading-relaxed">
                "{transcript}"
              </p>
            </div>
          )}

          {/* System message */}
          {voiceMessage && voiceMessage !== 'help' && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-2xl
              bg-blue-500/10 border border-blue-400/20">
              <Volume2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-blue-200 text-sm leading-relaxed">{voiceMessage}</p>
            </div>
          )}

          {/* Help suggestions */}
          {(voiceMessage === 'help'  voiceState === 'idle') && !transcript && (
            <div className="space-y-2">
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold">
                Try saying…
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTIONS.map(({ cmd, icon }) => (
                  <div key={cmd}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      bg-white/4 border border-white/8">
                    <span className="text-base">{icon}</span>
                    <span className="text-white/55 text-sm font-medium">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start button when idle */}
          {voiceState === 'idle' && (
            <button
              onClick={onToggleListening}
              className="w-full min-h-[56px] rounded-2xl font-bold text-base
                bg-gradient-to-r from-red-500 to-rose-500
                hover:from-red-400 hover:to-rose-400
                text-white shadow-lg shadow-red-500/25
                flex items-center justify-center gap-3
                transition-all duration-200 active:scale-[0.98]"
            >
              <Mic size={20} />
              Tap to Speak
            </button>
          )}

          {/* Stop button when listening */}
          {voiceState === 'listening' && (
            <button
              onClick={onToggleListening}
              className="w-full min-h-[56px] rounded-2xl font-bold text-base
                bg-red-500/20 border-2 border-red-400/50 text-red-300
                hover:bg-red-500/30
                flex items-center justify-center gap-3
                transition-all duration-200 active:scale-[0.98]"
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