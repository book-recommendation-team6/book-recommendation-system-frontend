import React from 'react';

const BookCover = React.memo(({ src, alt, className = '' }) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <img
          src={src}
          alt={alt}
          className={`w-full max-w-72 mx-auto rounded-lg shadow-lg ${className}`}
        />
      </div>
    </div>
  );
});



BookCover.displayName = 'BookCover';
export default BookCover;

