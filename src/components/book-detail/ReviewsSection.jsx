import React from 'react';
import RatingSummary from './RatingSummary';
import SectionHeader from '../SectionHeader';
import ReviewsList from './ReviewsList';

const ReviewsSection = React.memo(({ rating, totalReviews, reviews, onLoadMore }) => {
  return (
    <div className="border-t border-gray-300 pt-8">
      <SectionHeader title="Đánh giá & Nhận xét" />
      <div className="grid grid-cols-1">
        <RatingSummary rating={rating} totalReviews={totalReviews} />
        <ReviewsList reviews={reviews} onLoadMore={onLoadMore} />
      </div>
    </div>
  );
});

ReviewsSection.displayName = 'ReviewsSection';
export default ReviewsSection;