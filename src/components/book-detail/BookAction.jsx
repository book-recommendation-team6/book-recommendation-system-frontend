import React from 'react';
import { Heart, Download } from 'lucide-react';

const BookActions = React.memo(({ onRead, onFavorite, onDownload }) => {
  const iconButtonClass = "p-3 border border-primary bg-secondary/56 rounded-full hover:bg-secondary-hover/35 transition-colors";

  return (
    <div className="flex gap-3 mb-8">
      <button
        onClick={onRead}
        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold"
      >
        Bắt đầu Đọc
      </button>
      <button onClick={onFavorite} className={iconButtonClass} aria-label="Add to favorites">
        <Heart className="w-6 h-6 text-primary" />
      </button>
      <button onClick={onDownload} className={iconButtonClass} aria-label="Download book">
        <Download className="w-6 h-6 text-primary" />
      </button>
    </div>
  );
});

BookActions.displayName = 'BookActions';

export default BookActions;