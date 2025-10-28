
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import BookCarousel from "../components/BookCarousel";
import { getGenres } from "../services/genreService";
import books from "../data/book";
import MainLayout from "../layout/MainLayout";
import { getBooks } from '../services/manageBookService';

const Home = () => {
  const [bookList, setBookList] = useState([]);
  // const recommendedBooks = books.filter(b => b.category === 'recommended');
  // const newestBooks = books.filter(b => b.category === 'newest');
  // const skillsBooks = books.filter(b => b.category === 'skills');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks(0, 10);
        const books = response.data?.content || response.content || [];
        console.log("Fetched books for home page:", response);
        setBookList(books);
      } catch (error) {
        console.error("Failed to fetch books for home page:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <MainLayout showHero={true} heroContent={<Hero />}>
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <BookCarousel books={bookList} title="SÁCH DÀNH CHO BẠN" />
        <BookCarousel books={bookList} title="SÁCH MỚI CẬP NHẬT" />
        <BookCarousel books={bookList} title="KỸ NĂNG SỐNG" />
      </main>
    </MainLayout>
  );
};

export default Home;
