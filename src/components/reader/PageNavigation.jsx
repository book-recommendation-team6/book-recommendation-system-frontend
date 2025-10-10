import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PageNavigation = ({ currentPage, totalPages, onPrevPage, onNextPage, theme }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`flex items-center space-x-2 px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : (theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')} transition-colors`}
      >
        <FaArrowLeft />
        <span>Trang trước</span>
      </button>
      
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => {
          const pageNum = currentPage - 2 + i;
          if (pageNum > 0 && pageNum <= totalPages) {
            return (
              <button
                key={i}
                onClick={() => onPrevPage(pageNum)} // Sử dụng onPrevPage để chuyển đến trang cụ thể
                className={`w-10 h-10 rounded ${currentPage === pageNum ? (theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600')} transition-colors`}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}
      </div>
      
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center space-x-2 px-4 py-2 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : (theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')} transition-colors`}
      >
        <span>Trang sau</span>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default PageNavigation;