import React from 'react';
import { Star, PencilLine } from 'lucide-react';
import StarRating from './StarRating';

const RatingSummary = React.memo(({ rating, totalReviews, onWriteReview, ratingDistribution = {} }) => {
  const defaultDistribution = {
    5: 60,
    4: 25,
    3: 5,
    2: 5,
    1: 5,
  };

  const distribution = { ...defaultDistribution, ...ratingDistribution };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8 p-4 bg-gray-100 border border-gray-300 rounded-xl">
      {/* Rating Summary */}
      <div className="lg:col-span-1">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {rating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 mb-4">{totalReviews} đánh giá</div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="lg:col-span-5">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-4">
              <div className="flex flex-1 text-yellow-400 text-xs justify-end">
                <StarRating rating={stars} showValue={false} size="w-3 h-3" />
              </div>
              <div className="flex-5 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${distribution[stars]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onWriteReview}
        className="w-full flex items-center gap-1 lg:col-start-6 lg:col-span-3 py-2 px-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
    >
        <PencilLine size={20} /> Viết đánh giá
      </button>
    </div>
  );
});

RatingSummary.displayName = 'RatingSummary';
export default RatingSummary;