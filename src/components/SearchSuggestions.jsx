import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const SearchSuggestions = ({ suggestions, isLoading, onSelect, onClose }) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
    onSelect();
    onClose();
  };

  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Đang tìm kiếm...</p>
        </div>
      ) : (
        <div className="py-2">
          {suggestions.map((book) => (
            <button
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start gap-3 text-left"
            >
              {/* Book Cover */}
              <img
                src={book.coverImageUrl || '/placeholder.svg'}
                alt={book.title}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              
              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                  {book.authors?.map(a => a.name).join(', ') || 'Không rõ tác giả'}
                </p>
                {book.genres && book.genres.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <BookOpen size={10} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {book.genres.map(g => g.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
