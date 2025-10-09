import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BookCarousel from '../components/BookCarousel';
import Footer from '../components/Footer';
import books from '../data/book';


const Home = () => {
  const recommendedBooks = books.filter(b => b.category === 'recommended');
  const newestBooks = books.filter(b => b.category === 'newest');
  const skillsBooks = books.filter(b => b.category === 'skills');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookCarousel books={recommendedBooks} title="SÁCH DÀNH CHO BẠN" />
        <BookCarousel books={newestBooks} title="SÁCH MỚI CẬP NHẬT" />
        <BookCarousel books={skillsBooks} title="KỸ NĂNG SỐNG" />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;