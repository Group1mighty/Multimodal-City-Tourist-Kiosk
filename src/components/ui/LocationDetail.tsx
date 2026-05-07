import React, { useState } from 'react';
import {
  X, MapPin, Clock, Phone, Globe, Navigation,
  Tag, Star, ChevronRight
} from 'lucide-react';
import type { Location } from '../../types';
import { StarRating } from './StarRating';
import { cn } from '../../utils/cn';

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
  onTap: () => void;
  onSpeak: (text: string) => void;
  onSaveChange: (id: string, isSaved: boolean) => void;
}

const CATEGORY_ACCENT: Record<string, { text: string; bg: string; border: string }> = {
  Food:        { text: 'text-amber-300',   bg: 'bg-amber-500/15',   border: 'border-amber-400/30' },
  Attractions: { text: 'text-blue-300',    bg: 'bg-blue-500/15',    border: 'border-blue-400/30' },
  Transport:   { text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-400/30' },
};

const PRICE_LABEL: Record<string, string> = {
  '$': 'Budget-Friendly', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Luxury',
};

export const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onClose,
  onTap,
  onSpeak,
  onSaveChange,
}) => {
  const accent = CATEGORY_ACCENT[location.category];

  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem('saved_locations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.includes(location.id);
      }
    } catch (e) {}
    return false;
  });

  const handleSave = () => {
    onTap();
    setIsSaved((prev: boolean) => {
      const newState = !prev;
      try {
        const saved = localStorage.getItem('saved_locations');
        let parsed = saved ? JSON.parse(saved) : [];
        if (newState) {
          if (!parsed.includes(location.id)) parsed.push(location.id);
        } else {
          parsed = parsed.filter((id: string) => id !== location.id);
        }
        localStorage.setItem('saved_locations', JSON.stringify(parsed));
      } catch (e) {}
      onSaveChange(location.id, newState);
      return newState;
    });
  };

  const handleClose = () => {
    onTap();
    onClose();
  };

  const handleReadAloud = () => {
    onTap();
    onSpeak(
      `${location.name}. ${location.shortDesc}. Rating: ${location.rating} out of 5. ` +
      `Located at ${location.address}. Open ${location.openHours}.`
    );
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8
        bg-slate-950/80 backdrop-blur-md"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${location.name}`}
    >
      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto',
          'rounded-3xl border-2 shadow-2xl shadow-black/60',
          'bg-gradient-to-b from-slate-900 to-slate-950',
          accent.border
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero header */}
        <div className={cn(
          'relative h-48 overflow-hidden rounded-t-[22px]',
          !location.imageUrl && 'bg-gradient-to-br',
          !location.imageUrl && location.imageGradient
        )}>
          {location.imageUrl ? (
            <img 
              src={location.imageUrl} 
              alt={location.name} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          ) : (
            <>
              {/* Background dot pattern */}
              <div className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 30%, white 2px, transparent 2px),
                                    radial-gradient(circle at 70% 70%, white 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Large icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl drop-shadow-2xl animate-pulse" style={{ animationDuration: '3s' }}>
                  {location.icon}
                </span>
              </div>
            </>
          )}

          {/* Dark overlay for readability */}
          {location.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />}

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close details"
            className="absolute top-4 right-4 w-12 h-12 rounded-2xl
              bg-black/30 hover:bg-black/50 backdrop-blur-sm
              flex items-center justify-center transition-colors active:scale-95
              border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={22} className="text-white" />
          </button>

          {/* Featured badge */}
          {location.featured && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full
              bg-amber-400/90 text-slate-900 text-sm font-bold">
              ⭐ Featured Spot
            </span>
          )}

          {/* Distance */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5
            px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            <Navigation size={14} className="text-white/80" />
            <span className="text-white font-bold text-sm">{location.distance}</span>
            <span className="text-white/60 text-xs">away</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Category badge row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-semibold border',
              accent.bg, accent.text, accent.border
            )}>
              {location.category} · {location.subCategory}
            </span>
            {location.priceRange && (
              <span className="px-3 py-1.5 rounded-lg text-sm font-medium
                bg-white/8 text-white/60 border border-white/10">
                {location.priceRange} · {PRICE_LABEL[location.priceRange]}
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="text-white font-black text-2xl md:text-3xl lg:text-4xl leading-tight">
            {location.name}
          </h2>

          {/* Rating */}
          <StarRating
            rating={location.rating}
            reviewCount={location.reviewCount}
            size={18}
          />

          {/* Full description */}
          <p className="text-white/65 text-base leading-relaxed">
            {location.description}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-3">
            {/* Address */}
            <div className={cn(
              'flex items-start gap-3 p-4 rounded-2xl border',
              accent.bg, accent.border
            )}>
              <MapPin size={20} className={accent.text} />
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">
                  Address
                </p>
                <p className="text-white font-medium">{location.address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className={cn(
              'flex items-start gap-3 p-4 rounded-2xl border',
              accent.bg, accent.border
            )}>
              <Clock size={20} className={accent.text} />
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">
                  Opening Hours
                </p>
                <p className="text-white font-medium">{location.openHours}</p>
              </div>
            </div>

            {/* Contact row */}
            {(location.phone || location.website) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {location.phone && (
                  <div className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border',
                    accent.bg, accent.border
                  )}>
                    <Phone size={18} className={accent.text} />
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">
                        Phone
                      </p>
                      <p className="text-white font-medium text-sm">{location.phone}</p>
                    </div>
                  </div>
                )}
                {location.website && (
                  <div className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border',
                    accent.bg, accent.border
                  )}>
                    <Globe size={18} className={accent.text} />
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">
                        Website
                      </p>
                      <p className={cn('font-medium text-sm', accent.text)}>{location.website}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={14} className="text-white/40" />
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                Tags
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {location.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10
                    text-white/60 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReadAloud}
              className={cn(
                'flex-1 flex items-center justify-center gap-2.5',
                'min-h-[60px] rounded-2xl border-2 font-semibold text-base',
                'transition-all duration-200 active:scale-[0.98]',
                accent.bg, accent.text, accent.border,
                'hover:brightness-125'
              )}
            >
              <span className="text-xl">🔊</span>
              Read Aloud
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5",
                "min-h-[60px] rounded-2xl border-2 font-semibold text-base",
                "transition-all duration-200 active:scale-[0.98]",
                isSaved
                  ? "bg-amber-400 text-slate-900 border-amber-400 hover:bg-amber-300"
                  : "border-white/15 bg-white/8 hover:bg-white/15 text-white"
              )}
            >
              <Star size={18} className={isSaved ? "fill-slate-900" : ""} />
              {isSaved ? "Saved" : "Save"}
              {!isSaved && <ChevronRight size={16} className="text-white/40" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
