import React from 'react';
import { FaHome, FaBookmark, FaSun, FaMoon } from 'react-icons/fa';

const ReaderHeader = ({ bookTitle, onToggleSidebar, onToggleTheme, theme, onIncreaseFontSize, onDecreaseFontSize }) => {
  return (
    <header className={`${theme === 'light' ? 'bg-white shadow-md' : 'bg-gray-800 shadow-lg'} p-4 flex justify-between items-center`}>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className={`p-2 rounded ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} transition-colors`}
        >
          {/* Biểu tượng menu sẽ được quản lý ở component cha */}
        </button>
        <h1 className="text-xl font-bold">{bookTitle}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className={`p-2 rounded ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} transition-colors`}>
          <FaHome size={20} />
        </button>
        <button className={`p-2 rounded ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} transition-colors`}>
          <FaBookmark size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onDecreaseFontSize}
            className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
          >
            A-
          </button>
          <button 
            onClick={onIncreaseFontSize}
            className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
          >
            A+
          </button>
        </div>
        <button 
          onClick={onToggleTheme}
          className={`p-2 rounded ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} transition-colors`}
        >
          {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default ReaderHeader;