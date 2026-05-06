import React, { useEffect, useState, useCallback } from 'react';
import { Mic, TouchpadOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { cn } from '../../utils/cn';

interface SplashScreenProps {
  onEnter: () => void;
  onEnterWithVoice: () => void;
}

const ROTATING_TEXTS = [
  'Explore world-class dining',
  'Discover iconic landmarks',
  'Navigate the city with ease',
  'Find hidden local gems',
  'Plan your perfect day',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, onEnterWithVoice }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [pulseRing, setPulseRing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // ── Wake Word Recognition ───────────────────────────────────────────────
  const handleWakeWord = useCallback((transcript: string, isFinal: boolean) => {
    if (!isFinal) return;
    const t = transcript.toLowerCase();
    // Wake words: "speak to search", "help", "nova", "explore"
    if (/\b(speak to search|help|nova|explore)\b/.test(t)) {
      onEnterWithVoice();
    }
  }, [onEnterWithVoice]);

  const { start, stop } = useSpeechRecognition({
    continuous: true,
    interimResults: false,
    onTranscript: handleWakeWord,
  });

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  // Rotate subtitle text
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % ROTATING_TEXTS.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pulse ring animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRing(true);
      setTimeout(() => setPulseRing(false), 1000);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-between
        h-screen w-screen overflow-y-auto overflow-x-hidden cursor-pointer select-none"
      onClick={onEnter}
      role="button"
      aria-label="Touch to start exploring Nova Crest"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEnter()}
    >
      {/* ── Background ────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/city-hero.jpg)' }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b
        from-slate-950/70 via-slate-950/50 to-slate-950/90" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-64
        bg-gradient-to-t from-slate-950 to-transparent" />
        {/* ── Animated background orbs ──────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full
          bg-blue-500/10 blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full
          bg-purple-500/10 blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[600px] rounded-full
          bg-blue-400/5 blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }} />
      </div>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full flex items-center justify-between
        px-10 pt-8 pb-4">
        {/* City branding */}
        <div className="flex items-center gap-3">
          <span className="text-4xl drop-shadow-lg">🏙</span>
          <div>
            <h1 className="text-white font-black text-3xl tracking-tight leading-none drop-shadow">
              Nova<span className="text-blue-400">Crest</span>
            </h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              City Tourist Kiosk
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="text-right">
          <p className="text-white font-bold text-4xl tabular-nums drop-shadow">
            {currentTime}
          </p>
          <p className="text-white/50 text-sm">{currentDate}</p>
        </div>
      </header>

      {/* ── Center Hero ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">

        {/* Welcome badge */}
        <div className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20
          backdrop-blur-sm">
          <p className="text-white/80 text-sm font-medium tracking-wider uppercase">
            👋 Welcome to Nova Crest
          </p>
        </div>

        {/* Main heading */}
        <div className="space-y-3">
          <h2 className="text-white font-black leading-none drop-shadow-2xl"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Your City,
          </h2>
          <h2 className="font-black leading-none drop-shadow-2xl
            bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500
            bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Explored.
          </h2>
        </div>

        {/* Rotating subtitle */}
        <div className="h-10 flex items-center justify-center">
          <p
            className={cn(
              'text-white/60 text-xl font-light transition-all duration-400',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            {ROTATING_TEXTS[textIndex]}
          </p>
        </div>

        {/* CTA section — side by side */}
        <div className="flex items-center gap-6 mt-4">

          {/* Touch to Start */}
          <div className="relative flex flex-col items-center gap-3">
            {/* Outer pulse rings */}
            {pulseRing && (
              <>
                <span className="absolute w-44 h-44 rounded-full border-2 border-white/20
                  animate-ping" style={{ animationDuration: '1s' }} />
                <span className="absolute w-56 h-56 rounded-full border border-white/10
                  animate-ping" style={{ animationDuration: '1s', animationDelay: '0.1s' }} />
              </>
            )}
            {/* Main CTA button */}
            <div className="w-36 h-36 rounded-full border-2 border-white/30
              bg-white/10 backdrop-blur-md
              flex items-center justify-center
              shadow-2xl shadow-black/30
              group-hover:scale-105 transition-transform">
              <div className="w-28 h-28 rounded-full border border-white/20
                bg-white/10 flex flex-col items-center justify-center gap-2">
                <TouchpadOff size={32} className="text-white/80" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  Touch
                </span>
              </div>
            </div>

            <p className="text-white/50 text-sm font-medium">Touch to explore</p>
          </div>

          {/* Vertical divider */}
          <div className="flex flex-col items-center gap-2 self-stretch justify-center">
            <div className="flex-1 w-px bg-white/15" />
            <span className="text-white/30 text-sm font-medium">or</span>
            <div className="flex-1 w-px bg-white/15" />
          </div>

          {/* Voice shortcut */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl
                bg-white/8 border border-white/15 backdrop-blur-sm
                cursor-pointer hover:bg-white/15 hover:border-white/25 transition-all duration-200
                active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                onEnterWithVoice();
              }}
              role="button"
              aria-label="Enter kiosk with voice search active"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/30
                flex items-center justify-center">
                <Mic size={20} className="text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Speak to Search</p>
                <p className="text-white/40 text-xs">Say "Speak to search" to activate</p>
              </div>
            </div>
            <p className="text-white/50 text-sm font-medium">Say a command</p>
          </div>

        </div>
      </div>

      {/* ── Bottom stats strip ────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full px-10 pb-8">
        <div className="flex items-center justify-center gap-12">
          {[
            { value: '10', label: 'Locations', emoji: '📍' },
            { value: '3', label: 'Categories', emoji: '🗂' },
            { value: '4.5★', label: 'Avg Rating', emoji: '⭐️' },
            { value: '2', label: 'Interaction Modes', emoji: '🎯' },
          ].map(({ value, label, emoji }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{emoji}</span>
              <span className="text-white font-black text-2xl">{value}</span>
              <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Idle hint */}
        <p className="text-center text-white/20 text-xs mt-6">
          This screen returns automatically after 60 seconds of inactivity
        </p>
      </footer>
    </div>
  );
};
