import React from 'react';

const ReadingArea = ({ currentChapter, currentPage, totalPages, pageContent, fontSize, theme }) => {
  return (
    <main className="flex-1 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{currentChapter}</h2>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Trang {currentPage}/{totalPages}</div>
        </div>
        
        <div 
          className={`prose max-w-none ${fontSize} ${theme === 'light' ? 'prose-gray' : 'prose-invert'} mb-8`}
          dangerouslySetInnerHTML={{ __html: pageContent }}
        />
      </div>
    </main>
  );
};

export default ReadingArea;