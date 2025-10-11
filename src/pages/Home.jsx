import React from 'react';
import Hero from '../components/Hero';
import BookCarousel from '../components/BookCarousel';

import books from '../data/book';
import MainLayout from '../layout/MainLayout';

const Home = () => {
  const recommendedBooks = books.filter(b => b.category === 'recommended');
  const newestBooks = books.filter(b => b.category === 'newest');
  const skillsBooks = books.filter(b => b.category === 'skills');

  return (
    <MainLayout showHero={true} heroContent={<Hero />}>
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <BookCarousel books={recommendedBooks} title="SÁCH DÀNH CHO BẠN" />
        <BookCarousel books={newestBooks} title="SÁCH MỚI CẬP NHẬT" />
        <BookCarousel books={skillsBooks} title="KỸ NĂNG SỐNG" />
      </main>
    </MainLayout>
  );
};

export default Home;