import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  showNumber = true,
  reviewCount,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : half
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-white/20 fill-white/5'
              }
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-amber-300 font-bold text-sm">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-white/50 text-xs">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};
