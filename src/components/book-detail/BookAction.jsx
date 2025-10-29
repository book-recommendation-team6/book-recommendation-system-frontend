import React from 'react';
import { Heart, Download } from 'lucide-react';

const BookActions = React.memo(({ onRead, onFavorite, onDownload, isFavorited, loadingFavorite }) => {
  const iconButtonClass = "p-3 border border-primary bg-secondary/56 dark:bg-gray-700 dark:border-gray-600 rounded-full hover:bg-secondary-hover/35 dark:hover:bg-gray-600 transition-colors";

  return (
    <div className="flex gap-3 mb-8">
      <button
        onClick={onRead}
        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg transition-colors font-semibold"
      >
        Bắt đầu Đọc
      </button>
      <button 
        onClick={onFavorite} 
        className={`${iconButtonClass} ${loadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`} 
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        disabled={loadingFavorite}
      >
        <Heart 
          className={`w-6 h-6 transition-colors ${
            isFavorited 
              ? 'fill-red-500 text-red-500' 
              : 'text-primary dark:text-gray-300 hover:fill-red-200'
          } ${loadingFavorite ? 'animate-pulse' : ''}`}
        />
      </button>
      <button onClick={onDownload} className={iconButtonClass} aria-label="Download book">
        <Download className="w-6 h-6 text-primary dark:text-gray-300" />
      </button>
    </div>
  );
});

BookActions.displayName = 'BookActions';

export default BookActions;