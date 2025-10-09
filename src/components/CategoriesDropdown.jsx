import React from 'react';
import categories from '../data/categories';


const CategoryDropdown = () => {
  // if (!isOpen) return null;

  return (
    <div className="absolute pointer-events-none group-hover:pointer-events-auto top-full left-0 mt-0 pt-2 bg-transparent z-50 min-w-96">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl py-4 transition-all duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0 transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100">
        <div className="px-4 pb-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Sách</h3>
        </div>
        
        <div className="py-4 px-4">
          <div className="grid grid-cols-3 gap-8">
            {categories.columns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.title && (
                  <div className="pb-2">
                    <a className="text-sm font-medium text-white ">{column.title}</a>
                  </div>
                )}
                {column.items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left py-1 transition-colors text-sm text-gray-300 hover:text-blue-300"
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
    </div>
  );
};

export default CategoryDropdown;