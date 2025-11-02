

import React from 'react';
import { Search, ChevronDown, Facebook, Twitter, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import SectionHeader from './SectionHeader';

const BookCarousel = ({ books, title, genreId, genreName, subtitle }) => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
        <SectionHeader 
          title={title} 
          subtitle={subtitle} 
          genreId={genreId}
          genreName={genreName || title}
        />
      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả
        </button>
      </div> */}
      
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth p-2 "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookCarousel;
