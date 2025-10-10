import React , { useState }from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BookCarousel from '../components/BookCarousel';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import books from '../data/book';


const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register' or 'forgot' or 'confirm'
  const recommendedBooks = books.filter(b => b.category === 'recommended');
  const newestBooks = books.filter(b => b.category === 'newest');
  const skillsBooks = books.filter(b => b.category === 'skills');

  // Hàm này sẽ được truyền xuống cho Header để mở modal
  const openAuthModal = (mode) => {
    setAuthMode(mode); // Cập nhật chế độ (login/register)
    setShowAuthModal(true); // Hiển thị modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={openAuthModal} />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookCarousel books={recommendedBooks} title="SÁCH DÀNH CHO BẠN" />
        <BookCarousel books={newestBooks} title="SÁCH MỚI CẬP NHẬT" />
        <BookCarousel books={skillsBooks} title="KỸ NĂNG SỐNG" />
      </main>
      
      <Footer />

      {/* Render AuthModal có điều kiện */}
      {/* Chỉ hiển thị khi showAuthModal là true */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} // Hàm để đóng modal
          initialMode={authMode} // Truyền chế độ ban đầu
          onModeChange={setAuthMode} // Hàm để thay đổi chế độ từ bên trong modal
        />
      )}
    </div>
  );
};

export default Home;