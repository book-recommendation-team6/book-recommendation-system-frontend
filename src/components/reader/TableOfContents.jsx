
import React, { useState } from 'react';
import { X, ChevronRight, Edit3, BookOpen, Bookmark, FileText } from 'lucide-react';

const TableOfContents = ({ 
  tableOfContents, 
  currentPage, 
  onChapterSelect,
  onClose,
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState('muc-luc');

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-teal-400" />
            <h3 className="text-lg font-bold tracking-wide">Danh sách</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50 bg-gray-900/30">
        <button
          onClick={() => setActiveTab('muc-luc')}
          className={`flex-1 px-5 py-4 text-sm font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'muc-luc' 
              ? 'text-white bg-gray-800/50' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
          }`}
        >
          <FileText size={16} />
          <span className="whitespace-nowrap">Mục lục</span>
          {activeTab === 'muc-luc' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dau-trang')}
          className={`flex-1 px-5 py-4 text-sm font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'dau-trang' 
              ? 'text-white bg-gray-800/50' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
          }`}
        >
          <Bookmark size={16} />
          <span className="whitespace-nowrap" style={{ letterSpacing: '0.01em' }}>Dấu&nbsp;trang</span>
          {activeTab === 'dau-trang' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'muc-luc' && (
          <ul className="space-y-2">
            {tableOfContents.map((item, index) => (
              <li key={index} className="relative group">
                <button
                  onClick={() => onChapterSelect(item.page)}
                  className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    currentPage === item.page 
                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg shadow-teal-500/30' 
                      : 'hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-teal-300 mb-1">
                        {item.chapter}
                      </div>
                      <div className="text-sm font-medium line-clamp-2">
                        {item.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        currentPage === item.page 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-700/50 text-gray-400'
                      }`}>
                        {item.page}
                      </span>
                      {currentPage === item.page && (
                        <ChevronRight size={16} className="text-white animate-pulse" />
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {activeTab === 'dau-trang' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-4 py-3.5 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600/50 group">
              <div className="flex items-center gap-3">
                <Bookmark size={16} className="text-teal-400" />
                <span className="text-sm font-medium">Dấu trang 1</span>
              </div>
              <Edit3 size={14} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600/50 group">
              <div className="flex items-center gap-3">
                <Bookmark size={16} className="text-teal-400" />
                <span className="text-sm font-medium">Dấu trang 2</span>
              </div>
              <Edit3 size={14} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            </div>
            
            {/* Empty state */}
            {tableOfContents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bookmark size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có dấu trang</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        aside {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 1);
        }
      `}</style>
    </aside>
  );
};

export default TableOfContents;