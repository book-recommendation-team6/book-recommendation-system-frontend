import React from 'react';
import { useState } from 'react';
import SectionHeader from '../SectionHeader';

const BookDescription = React.memo(({ description, previewLength = 800 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const shouldTruncate = description.length > previewLength;
  const displayText = showFullDescription || !shouldTruncate
    ? description
    : description.substring(0, previewLength) + '...';

  return (
    <div className="mb-8">
      <SectionHeader title="Giới thiệu sách" />
      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify space-y-4">
          <div className="whitespace-pre-line">{displayText}</div>
          {shouldTruncate && (
            <div className="pt-2">
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary hover:text-primary-hover dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 inline-flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>
                    Thu gọn
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Xem thêm
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

BookDescription.displayName = 'BookDescription';
export default BookDescription;