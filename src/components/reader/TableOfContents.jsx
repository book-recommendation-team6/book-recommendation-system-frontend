import React from 'react';

const TableOfContents = ({ isOpen, tableOfContents, currentPage, onChapterSelect, theme }) => {
  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 z-20 w-64 h-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-lg transition-transform duration-300 overflow-y-auto`}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Mục lục</h2>
        <ul className="space-y-2">
          {tableOfContents.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onChapterSelect(item.page)}
                className={`w-full text-left p-2 rounded ${currentPage === item.page ? (theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300') : (theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700')} transition-colors`}
              >
                <div className="font-medium">{item.chapter}</div>
                <div className="text-sm opacity-75">{item.title}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default TableOfContents;