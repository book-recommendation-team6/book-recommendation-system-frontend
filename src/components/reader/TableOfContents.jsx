
import React, { useState } from 'react';
import { X, ChevronRight, Edit3 } from 'lucide-react';

const TableOfContents = ({ 
  tableOfContents, 
  currentPage, 
  onChapterSelect,
  onClose,
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState('muc-luc');

  return (
    <aside className="w-72 bg-gray-900 text-white shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Danh sách</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('muc-luc')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'muc-luc' 
              ? 'text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Mục lục
          {activeTab === 'muc-luc' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dau-trang')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'dau-trang' 
              ? 'text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Dấu trang
          {activeTab === 'dau-trang' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'muc-luc' && (
          <ul className="space-y-1">
            {tableOfContents.map((item, index) => (
              <li key={index} className="relative">
                <button
                  onClick={() => onChapterSelect(item.page)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                    currentPage === item.page 
                      ? 'bg-green-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{item.chapter}: {item.title}</div>
                </button>
                {currentPage === item.page && (
                  <ChevronRight size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
                )}
              </li>
            ))}
          </ul>
        )}
        
        {activeTab === 'dau-trang' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
              <span className="text-sm font-medium">Dấu trang 1</span>
              <Edit3 size={12} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
              <span className="text-sm font-medium">Dấu trang 2</span>
              <Edit3 size={12} className="text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TableOfContents;