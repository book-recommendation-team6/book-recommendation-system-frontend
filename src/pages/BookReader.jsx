import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Thêm import này
import { FaBars, FaTimes } from 'react-icons/fa';
import ReaderHeader from '../components/reader/ReaderHeader';
import TableOfContents from '../components/reader/TableOfContents';
import ReadingArea from '../components/reader/ReadingArea';
import PageNavigation from '../components/reader/PageNavigation';

const BookReader = () => {
  // Lấy ID từ URL
  const { id } = useParams();
  const navigate = useNavigate();      
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  const [theme, setTheme] = useState('light');
  const [book, setBook] = useState(null); // State để lưu thông tin sách
  
  // Mock function để tải sách dựa trên ID
  useEffect(() => {
    // Trong ứng dụng thực tế, bạn sẽ gọi API ở đây
    const fetchBook = async () => {
      // Mock data
      const mockBooks = {
        '1': {
          title: "Mưa Đỏ",
          author: "Chu Lai",
          chapters: [
            { chapter: "Chapter 1", title: "PLAN A VOYAGE", page: 1 },
            { chapter: "Chapter 2", title: "THE YACHT ELLA", page: 5 },
            // ... các chương khác
          ]
        },
        '2': {
          title: "The After House",
          author: "Mary Roberts Rinehart",
          chapters: [
            { chapter: "Chapter 1", title: "PLAN A VOYAGE", page: 1 },
            { chapter: "Chapter 2", title: "THE YACHT ELLA", page: 5 },
            // ... các chương khác
          ]
        }
      };
      
      // Tải sách dựa trên ID
      const bookData = mockBooks[id] || mockBooks['1']; // Mặc định là sách 1 nếu không tìm thấy
      setBook(bookData);
    };
    
    fetchBook();
  }, [id]);
  
  // Dữ liệu mẫu
  const currentChapter = "Chapter 1: PLAN A VOYAGE";
  const pageContent = `
    <p>Being a plain statement of the strange things that happened to me during the last ten weeks, I, Leslie MacQuarrie, M.D., write this narrative of my adventures on the yacht <em>Ella</em>, and of the curious events which followed my return from that ill-fated voyage.</p>
    
    <p>I am not a writer. I am a medical man, thirty-six years old, and for ten years I have been engaged in practice in a small city in the Middle West. I am a bachelor, living in rooms over my office. My income is moderate, but I am free from debt, and I have always been able to put aside a small sum each year.</p>
    
    <p>My brother, John MacQuarrie, is a mining engineer, and for some years has been interested in copper properties in the West. About a year ago he wrote to me that he had an opportunity to purchase a half-interest in a mine which he believed would prove very profitable, but that he lacked a few thousand dollars to secure the property.</p>
    
    <p>He asked if I could lend him the money, and I replied that I would do so with pleasure. I had known my brother to be a man of sound judgment, and I had confidence in his ability to select good investments.</p>
    
    <p>Within a month after I had sent the money, he wrote that he had secured the property and that it was even more valuable than he had anticipated. He advised me to come West and look over the property, and suggested that I take a vacation of several months.</p>
    
    <p>I had not had a vacation for five years, and the prospect of a long rest was very attractive. I arranged to close my office for three months, and started for the West.</p>
  `;
  
  const tableOfContents = book ? book.chapters : [
    { chapter: "Chapter 1", title: "PLAN A VOYAGE", page: 1 },
    { chapter: "Chapter 2", title: "THE YACHT ELLA", page: 5 },
    { chapter: "Chapter 3", title: "THE CREW", page: 12 },
    { chapter: "Chapter 4", title: "THE FIRST NIGHT", page: 18 },
    { chapter: "Chapter 5", title: "THE STRANGE PASSENGER", page: 25 },
    { chapter: "Chapter 6", title: "THE STORM", page: 32 },
    { chapter: "Chapter 7", title: "THE DISCOVERY", page: 40 },
    { chapter: "Chapter 8", title: "THE ACCUSATION", page: 48 },
    { chapter: "Chapter 9", title: "THE EVIDENCE", page: 55 },
    { chapter: "Chapter 10", title: "THE TRUTH", page: 62 },
  ];

  // Event Handlers
  const handlePrevPage = (page) => {
    if (page) {
      setCurrentPage(page);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handleChapterSelect = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };
  
  const increaseFontSize = () => {
    if (fontSize === 'text-base') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-xl');
    else if (fontSize === 'text-xl') setFontSize('text-2xl');
  };
  
  const decreaseFontSize = () => {
    if (fontSize === 'text-2xl') setFontSize('text-xl');
    else if (fontSize === 'text-xl') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-base');
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Hiển thị loading nếu chưa tải xong sách
  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-gray-100'} transition-colors duration-300`}>
      {/* Truyền props xuống các component con */}
      <ReaderHeader
        bookTitle={book.title}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleTheme={toggleTheme}
        theme={theme}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
      />
      
      <div className="flex">
        <TableOfContents
          isOpen={sidebarOpen}
          tableOfContents={tableOfContents}
          currentPage={currentPage}
          onChapterSelect={handleChapterSelect}
          theme={theme}
        />
        
        <div className="flex-1 flex flex-col">
          <ReadingArea
            currentChapter={currentChapter}
            currentPage={currentPage}
            totalPages={totalPages}
            pageContent={pageContent}
            fontSize={fontSize}
            theme={theme}
          />
          
          <div className="p-6 md:p-10 pt-0">
            <div className="max-w-4xl mx-auto">
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;