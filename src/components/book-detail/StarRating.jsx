import React from 'react';

import { Star } from 'lucide-react';

const StarRating = React.memo(({ rating, maxStars = 5, size = 'w-5 h-5', showValue = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-400">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.floor(rating) ? 'fill-current' : 'stroke-current'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';
export default StarRating;