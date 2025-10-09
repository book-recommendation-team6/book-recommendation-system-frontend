import React from 'react';
import categories from '../data/categories';


const CategoryDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 bg-gray-800 text-white rounded-lg shadow-xl py-4 z-50 min-w-96">
      <div className="px-4 pb-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Thể loại</h3>
      </div>
      
      <div className="py-4 px-4">
        <div className="grid grid-cols-3 gap-8">
          {categories.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-2">
              {column.title && (
                <div className="pb-2">
                  <h4 className="text-sm font-medium text-white">{column.title}</h4>
                </div>
              )}
              {column.items.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left py-1 hover:text-gray-300 transition-colors text-sm text-gray-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4 pt-2 border-t border-gray-700">
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium py-2">
          Xem thêm →
        </button>
      </div>
    </div>
  );
};

export default CategoryDropdown;