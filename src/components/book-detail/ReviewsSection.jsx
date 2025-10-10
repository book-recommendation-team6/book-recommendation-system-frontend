import React, {useState} from 'react';
import RatingSummary from './RatingSummary';
import SectionHeader from '../SectionHeader';
import ReviewsList from './ReviewsList';
import ReviewModal from './ReviewModal';

const ReviewsSection = React.memo(({ rating, totalReviews, reviews, onLoadMore, bookTitle }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewsList, setReviewsList] = useState(reviews);

    const handleWriteReview = () => {
        setIsReviewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsReviewModalOpen(false);
    };

    const handleSubmitReview = (newReview) => {
        // Add new review to the beginning of the list
        setReviewsList([newReview, ...reviewsList]);
        
        // In a real app, you would also send this to your backend API
        console.log('New review submitted:', newReview);
    };
    return (
        <>
        <div className="border-t border-gray-300 pt-8">
        <SectionHeader title="Đánh giá & Nhận xét" />
        <div className="grid grid-cols-1">
            <RatingSummary rating={rating} totalReviews={totalReviews}  onWriteReview={handleWriteReview}/>
            <ReviewsList reviews={reviews} onLoadMore={onLoadMore} />
        </div>
        </div>
        {/* Review Modal */}
        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitReview}
            bookTitle={bookTitle}
        />
        </>
    );
});

ReviewsSection.displayName = 'ReviewsSection';
export default ReviewsSection;