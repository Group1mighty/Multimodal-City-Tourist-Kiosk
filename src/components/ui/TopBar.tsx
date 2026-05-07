import React from 'react';
import { MapPin, Clock, Wifi, Menu, X } from 'lucide-react';

interface TopBarProps {
  currentTime: string;
  city: string;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTime, city, onToggleMenu, isMenuOpen }) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4
      bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95
      backdrop-blur-md border-b border-white/10 shadow-lg gap-4">

      {/* Left: Hamburger & Location */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        {onToggleMenu && (
          <button
            onClick={onToggleMenu}
            className="md:hidden w-11 h-11 shrink-0 rounded-xl bg-white/10 border border-white/20
              flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30
          items-center justify-center shrink-0">
          <MapPin size={20} className="text-blue-400" />
        </div>
        <div className="hidden lg:block min-w-0">
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium">You are in</p>
          <p className="text-white font-bold text-lg leading-tight truncate">{city}</p>
        </div>
      </div>

      {/* Center: Brand */}
      <div className="flex flex-col items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl">🏙️</span>
          <div>
            <h1 className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-none">
              Nova<span className="text-blue-400">Crest</span>
            </h1>
            <p className="text-white/40 text-[10px] sm:text-xs tracking-widest uppercase text-center mt-0.5">
              Tourist Guide
            </p>
          </div>
        </div>
      </div>

      {/* Right: Time & Status */}
      <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
        <div className="hidden md:flex items-center gap-2">
          <Wifi size={16} className="text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10
            flex items-center justify-center shrink-0">
            <Clock size={16} className="text-white/60" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-white font-bold text-lg leading-none tabular-nums">
              {currentTime}
            </p>
            <p className="text-white/40 text-xs mt-0.5">Local Time</p>
          </div>
        </div>
      </div>
    </header>
  );
};
