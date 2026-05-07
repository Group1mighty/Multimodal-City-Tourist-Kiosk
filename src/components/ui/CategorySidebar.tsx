import React from 'react';
import type { Category } from '../../types';
import { CATEGORY_META, locations } from '../../data/locations';
import { cn } from '../../utils/cn';

interface CategorySidebarProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
  onTap: () => void;
  className?: string;
}

const CATEGORIES: Category[] = ['All', 'Food', 'Attractions', 'Transport'];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  activeCategory,
  onSelect,
  onTap,
  className,
}) => {
  const countFor = (cat: Category) =>
    cat === 'All'
      ? locations.length
      : locations.filter((l) => l.category === cat).length;

  return (
    <aside className={cn(
      'w-64 flex flex-col gap-3 py-6 px-4 shrink-0 backdrop-blur-md',
      'bg-slate-950/95 border-r border-white/8 text-white overflow-y-auto z-30 scrollable',
      className
    )}>

      {/* Section title */}
      <div className="mb-2 px-2">
        <p className={cn(
          'text-xs uppercase tracking-widest font-semibold',
          'text-white/30'
        )}>
          Browse By
        </p>
      </div>

      {/* Category buttons */}
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const isActive = activeCategory === cat;
        const count = countFor(cat);

        return (
          <button
            key={cat}
            onClick={() => {
              onTap();
              onSelect(cat);
            }}
            aria-pressed={isActive}
            aria-label={`Filter by ${cat} — ${count} locations`}
            className={cn(
              // Base styles — kiosk-compliant minimum touch target
              'group relative flex items-center gap-4 w-full px-4 rounded-2xl shrink-0',
              'min-h-[72px] text-left border-2 transition-all duration-200',
              'focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60',
              'active:scale-[0.97]',
              isActive
                ? cn(
                    'border-transparent shadow-lg shadow-black/20',
                    'bg-gradient-to-r',
                    cat === 'All'   && 'from-white/20 to-white/10',
                    cat === 'Food'  && 'from-amber-500/30 to-amber-500/10',
                    cat === 'Attractions' && 'from-blue-500/30 to-blue-500/10',
                    cat === 'Transport'   && 'from-emerald-500/30 to-emerald-500/10'
                  )
                : 'border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/20 text-white/80'
            )}
          >
            {/* Active left indicator */}
            {isActive && (
              <span className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full',
                cat === 'All'         && 'bg-white',
                cat === 'Food'        && 'bg-amber-400',
                cat === 'Attractions' && 'bg-blue-400',
                cat === 'Transport'   && 'bg-emerald-400'
              )} />
            )}

            {/* Icon bubble */}
            <span className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center text-2xl',
              'shrink-0 transition-transform duration-200',
              'group-active:scale-110',
              isActive ? meta.bgColor : 'bg-white/5'
            )}>
              {meta.icon}
            </span>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                'font-bold text-base leading-tight',
                isActive ? meta.color : 'text-white/70'
              )}>
                {cat}
              </p>
              <p className="text-white/35 text-xs mt-0.5 leading-tight">
                {meta.description}
              </p>
            </div>

            {/* Count badge */}
            <span className={cn(
              'shrink-0 min-w-[28px] h-7 px-2 rounded-full flex items-center justify-center',
              'text-xs font-bold transition-colors duration-200',
              isActive
                ? cn(
                    cat === 'All'         && 'bg-white/20 text-white',
                    cat === 'Food'        && 'bg-amber-400/20 text-amber-300',
                    cat === 'Attractions' && 'bg-blue-400/20 text-blue-300',
                    cat === 'Transport'   && 'bg-emerald-400/20 text-emerald-300'
                  )
                : 'bg-white/8 text-white/40'
            )}>
              {count}
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div className="border-t border-white/8 my-2" />

      {/* Quick info */}
      <div className="px-2 space-y-3">
        <p className={cn(
          'text-xs uppercase tracking-widest font-semibold',
          'text-white/30'
        )}>
          Quick Tips
        </p>
        {[
          { emoji: '👆', tip: 'Tap any card to see details' },
          { emoji: '🎤', tip: 'Use voice to search hands-free' },
          { emoji: '⭐', tip: 'Ratings from verified visitors' },
        ].map(({ emoji, tip }) => (
          <div key={tip} className="flex items-start gap-2.5">
            <span className="text-base leading-none mt-0.5">{emoji}</span>
            <p className={cn(
              'text-xs leading-relaxed',
              'text-white/40'
            )}>{tip}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};
