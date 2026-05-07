import React from 'react';
import { MapPin, Clock, Navigation, ChevronRight } from 'lucide-react';
import type { Location } from '../../types';
import { StarRating } from './StarRating';
import { cn } from '../../utils/cn';

interface LocationCardProps {
  location: Location;
  onSelect: (location: Location) => void;
  onTap: () => void;
  featured?: boolean;
}

const CATEGORY_ACCENT: Record<string, string> = {
  Food:        'border-amber-400/30 hover:border-amber-400/60',
  Attractions: 'border-blue-400/30 hover:border-blue-400/60',
  Transport:   'border-emerald-400/30 hover:border-emerald-400/60',
};

const CATEGORY_BADGE: Record<string, string> = {
  Food:        'bg-amber-500/20 text-amber-300 border-amber-400/30',
  Attractions: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  Transport:   'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
};

const PRICE_LABEL: Record<string, string> = {
  '$':    'Budget',
  '$$':   'Moderate',
  '$$$':  'Upscale',
  '$$$$': 'Luxury',
};

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onSelect,
  onTap,
  featured = false,
}) => {
  return (
    <button
      onClick={() => {
        onTap();
        onSelect(location);
      }}
      aria-label={`View details for ${location.name}`}
      className={cn(
        'group relative w-full text-left rounded-3xl overflow-hidden',
        'border-2 transition-all duration-300',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60',
        'active:scale-[0.98]',
        'bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800/70 shadow-lg hover:shadow-xl hover:shadow-black/30',
        CATEGORY_ACCENT[location.category],
        featured && 'ring-1 ring-amber-400/20',
      )}
    >
      {/* Header area */}
      <div className={cn(
        'relative h-32 flex items-end p-4 overflow-hidden',
        !location.imageUrl && 'bg-gradient-to-br',
        !location.imageUrl && location.imageGradient
      )}>
        {location.imageUrl ? (
          <img 
            src={location.imageUrl} 
            alt={location.name} 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                                  radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />

            {/* Icon */}
            <span className="relative text-5xl drop-shadow-lg transform
              group-hover:scale-110 transition-transform duration-300">
              {location.icon}
            </span>
          </>
        )}
        
        {/* Dark overlay for readability if using image */}
        {location.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />}

        {/* Featured badge */}
        {featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full
            bg-amber-400/90 text-slate-900 text-xs font-bold backdrop-blur-sm">
            ⭐ Featured
          </span>
        )}

        {/* Distance badge */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5
          px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm
          text-white text-xs font-medium">
          <Navigation size={10} className="text-white/70" />
          {location.distance}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category + subcategory badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-semibold border',
            CATEGORY_BADGE[location.category]
          )}>
            {location.subCategory}
          </span>
          {location.priceRange && (
            <span className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium border',
              'bg-white/8 text-white/50 border-white/10'
            )}>
              {location.priceRange} · {PRICE_LABEL[location.priceRange]}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className={cn(
          'font-bold text-lg leading-tight transition-colors duration-200 line-clamp-1',
          'text-white group-hover:text-blue-200'
        )}>
          {location.name}
        </h3>

        {/* Rating */}
        <StarRating
          rating={location.rating}
          reviewCount={location.reviewCount}
          size={13}
        />

        {/* Short description */}
        <p className={cn(
          'text-sm leading-relaxed line-clamp-2',
          'text-white/55'
        )}>
          {location.shortDesc}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-1">
          <div className={cn(
            'flex items-center gap-1.5 text-xs',
            'text-white/35'
          )}>
            <Clock size={12} />
            <span className="truncate max-w-[140px]">
              {location.openHours.split('|')[0].trim()}
            </span>
          </div>
          <div className={cn(
            'flex items-center gap-1 text-xs',
            'text-white/35'
          )}>
            <MapPin size={11} />
            <span className="truncate max-w-[80px]">
              {location.address.split(',').slice(-1)[0].trim()}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          <div className="flex gap-1.5 flex-wrap">
            {location.tags.slice(0, 2).map((tag) => (
              <span key={tag}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  'bg-white/5 text-white/40'
                )}>
                {tag}
              </span>
            ))}
          </div>
          <span className={cn(
            'flex items-center gap-1 text-xs font-semibold transition-all duration-200',
            'text-blue-400'
          )}>
            Details
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
};
