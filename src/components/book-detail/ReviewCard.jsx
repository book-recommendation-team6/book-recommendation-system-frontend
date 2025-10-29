import React from 'react';

import { Star } from 'lucide-react';

const ReviewCard = React.memo(({ review }) => {
  const { name, date, rating, comment } = review;
  const initial = (name || 'Ẩn danh').charAt(0).toUpperCase(); // Xử lý trường hợp name là undefined/null

  return (
    <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 bg-gray-100 p-4 rounded-xl">
      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          <span className="font-semibold text-gray-900">{name}</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-current' : 'stroke-current'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed break-words">
          {comment}
        </p>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';
export default ReviewCard;