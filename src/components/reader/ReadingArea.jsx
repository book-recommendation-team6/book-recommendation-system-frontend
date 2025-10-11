import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReadingArea = forwardRef(({ 
  pageContent, 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage,
  isDarkMode,
  pageChangeTrigger,
  contentRef,
  measureRef,
  isLoading
}, ref) => {
  const [flashEffect, setFlashEffect] = useState(false);
  
  useImperativeHandle(ref, () => ({
    getContentNode: () => contentRef.current
  }));
  
  // Kích hoạt hiệu ứng nhấp nháy khi pageChangeTrigger thay đổi
  useEffect(() => {
    if (pageChangeTrigger) {
      setFlashEffect(true);
      const timer = setTimeout(() => {
        setFlashEffect(false);
      }, 300); // Hiệu ứng kéo dài 300ms
      
      return () => clearTimeout(timer);
    }
  }, [pageChangeTrigger]);

  return (
    <div className={`relative flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} ${flashEffect ? 'animate-pulse' : ''}`}>
      {/* Previous Page Button - Fixed position */}
      <button 
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black text-white rounded-full p-3 shadow-lg transition-all duration-200 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Book Page with 2 columns */}
      <div className="h-full w-full overflow-hidden pt-20 pb-20">
        <div 
          ref={contentRef}
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} max-w-5xl mx-auto min-h-full py-12 px-8 transition-transform duration-300`}
          style={{
            columnCount: 2,
            columnGap: '2rem',
            transform: `translateX(-${(currentPage - 1) * 100}%)`,
            width: `${totalPages * 100}%`
          }}
        >
          {/* Chapter Header */}
          <div className="text-center mb-12 break-inside-avoid">
            <h1 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chap 1</h1>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PLAN A VOYAGE</h2>
          </div>
          
          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
        
        {/* Element để đo kích thước */}
        <div 
          ref={measureRef}
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} max-w-5xl w-full mx-auto min-h-full py-12 px-8`}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 'calc(100vh - 10rem)',
            top: '5rem'
          }}
        />
      </div>

      {/* Next Page Button - Fixed position */}
      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black text-white rounded-full p-3 shadow-lg transition-all duration-200 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
        }`}
      >
        <ChevronRight size={20} />
      </button>
      
      {/* Page Number - Bottom right corner */}
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-lg bg-gray-700 text-white shadow-md z-20`}>
        <div className="text-sm font-medium">
          {currentPage}/{totalPages}
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg">Đang tính toán số trang...</div>
        </div>
      )}
    </div>
  );
});

export default ReadingArea;