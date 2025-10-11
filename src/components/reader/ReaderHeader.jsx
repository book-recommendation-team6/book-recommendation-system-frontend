import React from 'react';
import { ChevronLeft, Bookmark, Menu, Moon } from 'lucide-react';

const ReaderHeader = ({ 
  bookTitle, 
  currentPage, 
  totalPages, 
  onGoBack, 
  onToggleDarkMode, 
  onToggleBookmark, 
  onToggleMenu,
  isDarkMode 
}) => {
  return (
    <header className={`h-16 ${isDarkMode ? 'bg-gray-800' : 'bg-black'} text-white flex items-center justify-between px-6 shadow-lg`}>
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onGoBack}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium">Trang</span>
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-sm font-medium text-black">{currentPage}</span>
        </div>
        <span className="text-sm font-medium">/{totalPages}</span>
      </div>
      
      {/* Center - Book title */}
      <h1 className="text-lg font-semibold truncate max-w-md">
        {bookTitle}
      </h1>
      
      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleDarkMode}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <Moon size={20} />
        </button>
        
        {/* Toggle switch */}
        <button 
          onClick={onToggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        
        <button 
          onClick={onToggleBookmark}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <Bookmark size={20} />
        </button>
        
        <button 
          onClick={onToggleMenu}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};

export default ReaderHeader;