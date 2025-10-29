import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewsList = React.memo(({ reviews, onLoadMore, hasMore = true }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {reviews.map((review, index) => (
        <ReviewCard key={`review-${index}-${review.date}`} review={review} />
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-2xl font-medium py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
});

ReviewsList.displayName = 'ReviewsList';
export default ReviewsList;