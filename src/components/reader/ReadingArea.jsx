import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReadingArea = forwardRef(({ 
  pageContent, 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage,
  isDarkMode,
  pageChangeTrigger,
  onTotalPagesChange
}, ref) => {
  const [flashEffect, setFlashEffect] = useState(false);
  const [pages, setPages] = useState([]); // State để lưu nội dung của từng trang
  const [isLoading, setIsLoading] = useState(true); // State để hiển thị loading
  const measureRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getMeasureNode: () => measureRef.current
  }));
  
  useEffect(() => {
    if (pageChangeTrigger) {
      setFlashEffect(true);
      const timer = setTimeout(() => setFlashEffect(false), 300);
      return () => clearTimeout(timer);
    }
  }, [pageChangeTrigger]);

  // HÀM ĐÃ ĐƯỢC SỬA LỖI: Chia nội dung thành các trang một cách chính xác
  const paginateContent = useCallback(() => {
    if (!measureRef.current || !pageContent) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const pageHeight = measureRef.current.clientHeight;
    if (pageHeight === 0) {
      setIsLoading(false);
      return;
    }

    // Tạo một container tạm để đo lường với đúng bố cục 2 cột
    const tempContainer = document.createElement('div');
    tempContainer.style.width = `${measureRef.current.clientWidth}px`;
    tempContainer.style.padding = '2rem';
    tempContainer.style.columnCount = '2';
    tempContainer.style.columnGap = '2rem';
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    const newPages = [];
    
    // Tạo một div chứa các phần tử để dễ dàng thao tác
    const contentHolder = document.createElement('div');
    contentHolder.innerHTML = pageContent;
    const elements = Array.from(contentHolder.children);

    let currentPageElements = [];

    for (const element of elements) {
      // Thêm phần tử vào trang hiện tại trong container tạm
      currentPageElements.push(element);
      tempContainer.innerHTML = ''; // Xóa nội dung cũ
      currentPageElements.forEach(el => tempContainer.appendChild(el.cloneNode(true)));

      // Đo chiều cao của container sau khi thêm phần tử mới
      const containerHeight = tempContainer.scrollHeight;

      // Nếu chiều cao vượt quá trang và có ít nhất 1 phần tử
      if (containerHeight > pageHeight && currentPageElements.length > 1) {
        // Lấy phần tử vừa thêm ra khỏi trang hiện tại
        const lastElement = currentPageElements.pop();
        
        // Lấy HTML của các phần tử vừa đủ cho trang này
        const pageContentHTML = currentPageElements.map(el => el.outerHTML).join('');
        newPages.push(pageContentHTML);

        // Bắt đầu trang mới với phần tử vừa lấy ra
        currentPageElements = [lastElement];
      }
    }

    // Thêm các phần tử còn lại vào trang cuối cùng
    if (currentPageElements.length > 0) {
      const lastPageContentHTML = currentPageElements.map(el => el.outerHTML).join('');
      newPages.push(lastPageContentHTML);
    }

    document.body.removeChild(tempContainer);

    setPages(newPages);
    onTotalPagesChange(newPages.length);
    setIsLoading(false);
  }, [pageContent, onTotalPagesChange]);

  // Tính toán lại khi component mount hoặc khi nội dung/theme thay đổi
  useEffect(() => {
    const timer = setTimeout(paginateContent, 100); // Đợi DOM render
    window.addEventListener('resize', paginateContent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', paginateContent);
    };
  }, [paginateContent]);

  return (
    <div className={`relative flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} ${flashEffect ? 'animate-pulse' : ''}`}>
      {/* Previous Page Button */}
      <button 
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black text-white rounded-full p-3 shadow-lg transition-all duration-200 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Container chính */}
      <div className="h-full w-full overflow-hidden pt-20 pb-20">
        {/* Đây là "KHUNG SÁCH" - chỉ hiển thị nội dung của trang hiện tại */}
        <div 
          ref={measureRef}
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} max-w-5xl mx-auto relative shadow-xl`}
          style={{
            height: 'calc(100vh - 12rem)',
          }}
        >
          {/* Nội dung của trang hiện tại */}
          <div className="py-12 px-8" style={{ columnCount: 2, columnGap: '2rem' }}>
            {/* Chỉnh cỡ chữ nhỏ hơn ở đây: prose-sm thay vì prose-lg */}
            <div 
              className="prose prose-sm max-w-full"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: pages[currentPage - 1] || '' }}
            />
          </div>
        </div>
      </div>

      {/* Next Page Button */}
      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black text-white rounded-full p-3 shadow-lg transition-all duration-200 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
        }`}
      >
        <ChevronRight size={20} />
      </button>
      
      {/* Page Number */}
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-lg bg-gray-700 text-white shadow-md z-20`}>
        <div className="text-sm font-medium">
          {currentPage}/{totalPages}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg">Đang tải trang...</div>
        </div>
      )}
    </div>
  );
});

export default ReadingArea;