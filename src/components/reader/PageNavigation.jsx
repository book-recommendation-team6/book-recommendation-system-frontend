import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PageNavigation = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage,
  isDarkMode 
}) => {
  return (
    <div className={`flex items-center justify-center space-x-4 py-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <button 
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 rounded-md ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <ChevronLeft size={16} className="mr-1" />
        Trang trước
      </button>
      
      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Trang {currentPage} / {totalPages}
      </div>
      
      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 rounded-md ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Trang sau
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default PageNavigation;