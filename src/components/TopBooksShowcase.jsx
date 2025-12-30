import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopBooksShowcase = ({ books = [], title = "Top sách nổi bật" }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  if (!books || books.length === 0) {
    return null;
  }

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Lấy tối đa 4 cuốn sách
  const topBooks = books.slice(0, 4);

  const BookItem = ({ book, index }) => (
    <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-auto flex-shrink-0 snap-start">
      <div
        className={`group relative w-full h-full max-h-[600px] cursor-pointer bg-transparent hover:bg-[#FFD875] shadow-lg hover:shadow-2xl ${
          index % 2 === 0 ? "clip-slant-left" : "clip-slant-right"
        }`}
        onClick={() => handleBookClick(book.id)}
      >
        {/* Book Cover Background */}
        <div
          className={`relative w-full h-full group group-hover:scale-[97%] overflow-hidden transition-transform ease-in-out duration-300 ${
            index % 2 === 0 ? "clip-slant-left" : "clip-slant-right"
          }`}
        >
          {/* Inner wrapper with alternating slanted top edge */}
          <img
            src={
              book.coverImageUrl || book.cover || "/placeholder-book.jpg"
            }
            alt={book.title}
            className={`h-full w-full object-cover`}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-amber-300/10 group-hover:bg-amber-300/20 opacity-0 group-hover:opacity-100 transition-transform duration-200 pointer-events-none" />
          <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px] opacity-20"/>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div>
          <span className="bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] font-sekuya text-transparent bg-clip-text font-bold text-4xl">
            {index + 1}
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <p 
            className="dark:text-white font-sans truncate cursor-pointer hover:text-[rgba(254,207,89,1)]" 
            onClick={() => handleBookClick(book.id)}
          >
            {book.title}
          </p>
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
            {book.authors?.map(a => a.name).join(", ") || "Không rõ tác giả"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mb-25">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      {/* Desktop Grid Layout (lg and up) */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4 bg-none">
        {topBooks.map((book, index) => (
          <BookItem key={book.id} book={book} index={index} />
        ))}
      </div>

      {/* Mobile/Tablet Carousel Layout (below lg) */}
      <div className="lg:hidden relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topBooks.map((book, index) => (
            <BookItem key={book.id} book={book} index={index} />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
      </div>
    </section>
  );
};

export default TopBooksShowcase;
