import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onTap: () => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onTap,
  resultCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        'relative flex-1 flex items-center gap-3',
        'bg-white/6 border-2 rounded-2xl px-5',
        'transition-all duration-200',
        'focus-within:ring-4 focus-within:ring-blue-400',
        value
          ? 'border-blue-400/50 shadow-lg shadow-blue-500/10'
          : 'border-white/10 focus-within:border-blue-400/50'
      )}>
        <Search
          size={22}
          className={cn(
            'shrink-0 transition-colors duration-200',
            value ? 'text-blue-400' : 'text-white/30'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onTap();
            onChange(e.target.value);
          }}
          onFocus={onTap}
          placeholder="Search locations, categories, or activities…"
          aria-label="Search locations"
          className={cn(
            'flex-1 bg-transparent text-white placeholder-white/25',
            'text-lg font-medium py-4 outline-none focus:outline-0',
            'min-h-[64px]' // kiosk touch target
          )}
        />
        {value && (
          <button
            onClick={() => {
              onTap();
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="shrink-0 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20
              flex items-center justify-center transition-colors active:scale-95"
          >
            <X size={16} className="text-white/60" />
          </button>
        )}
      </div>

      {/* Results indicator */}
      {value && (
        <div className="shrink-0 px-4 py-2.5 rounded-xl bg-white/8 border border-white/10">
          <p className="text-white font-bold text-base leading-none">{resultCount}</p>
          <p className="text-white/40 text-xs mt-0.5">
            {resultCount === 1 ? 'result' : 'results'}
          </p>
        </div>
      )}
    </div>
  );
};
