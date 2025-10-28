import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hero from "../components/Hero";
import BookCarousel from "../components/BookCarousel";
import MainLayout from "../layout/MainLayout";
import { getBooks, getBooksByGenre, searchBooks } from "../services/manageBookService";

const DEFAULT_PAGE_SIZE = 12;

const Home = () => {
  const [bookList, setBookList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectedGenreRef = useRef(null);
  const searchEffectInitialized = useRef(false);
  const genreEffectInitialized = useRef(false);
  const searchTermRef = useRef("");
  const suppressNextSearchEffect = useRef(false);

  const loadBooks = useCallback(async ({ genreId, keyword } = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (keyword) {
        response = await searchBooks(keyword, 0, DEFAULT_PAGE_SIZE);
      } else if (genreId) {
        response = await getBooksByGenre(genreId, 0, DEFAULT_PAGE_SIZE);
      } else {
        response = await getBooks(0, DEFAULT_PAGE_SIZE);
      }

      const books = response?.data?.content || response?.content || [];
      setBookList(Array.isArray(books) ? books : []);
    } catch (err) {
      console.error("Failed to load books for home page:", err);
      setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      setBookList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    selectedGenreRef.current = selectedGenre;
  }, [selectedGenre]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (!searchEffectInitialized.current) {
      searchEffectInitialized.current = true;
      return;
    }

    const trimmedSearch = searchTerm.trim();
    if (suppressNextSearchEffect.current && !trimmedSearch) {
      suppressNextSearchEffect.current = false;
      return;
    }
    const handler = setTimeout(() => {
      if (trimmedSearch) {
        loadBooks({ keyword: trimmedSearch });
        return;
      }

      const currentGenreId = selectedGenreRef.current?.id;
      if (currentGenreId) {
        loadBooks({ genreId: currentGenreId });
      } else {
        loadBooks();
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, loadBooks]);

  useEffect(() => {
    if (!genreEffectInitialized.current) {
      genreEffectInitialized.current = true;
      return;
    }

    if (searchTermRef.current.trim()) {
      return;
    }

    const genreId = selectedGenre?.id;
    if (genreId) {
      loadBooks({ genreId });
    } else {
      loadBooks();
    }
  }, [selectedGenre, loadBooks]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre ?? null);
    if (searchTerm) {
      suppressNextSearchEffect.current = true;
      setSearchTerm("");
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim() && selectedGenreRef.current) {
      setSelectedGenre(null);
    }
  };

  const handleSearchSubmit = (keyword) => {
    const normalizedKeyword = keyword.trim();
    handleSearchChange(normalizedKeyword);
  };

  const activeGenreName = useMemo(() => {
    if (!selectedGenre) {
      return null;
    }
    return selectedGenre.name ?? null;
  }, [selectedGenre]);

  const sectionTitle = useMemo(() => {
    if (searchTerm) {
      return `Kết quả tìm kiếm cho "${searchTerm}"`;
    }
    if (activeGenreName) {
      return `Sách thể loại ${activeGenreName}`;
    }
    return "SÁCH DÀNH CHO BẠN";
  }, [searchTerm, activeGenreName]);

  const showEmptyState = !loading && !error && bookList.length === 0;

  return (
    <MainLayout
      showHero={true}
      heroContent={<Hero />}
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
      onGenreSelect={handleGenreSelect}
    >
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải sách...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
            <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {showEmptyState && (
          <div className="py-16 text-center bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300">
              Không tìm thấy sách phù hợp với lựa chọn của bạn.
            </p>
          </div>
        )}

        {!loading && !error && bookList.length > 0 && (
          <BookCarousel books={bookList} title={sectionTitle} />
        )}
      </main>
    </MainLayout>
  );
};

export default Home;
