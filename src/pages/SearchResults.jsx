import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import BookCarousel from "../components/BookCarousel";
import { searchBooks } from "../services/manageBookService";

const DEFAULT_PAGE_SIZE = 12;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("q") || "";
  
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!keyword.trim()) {
        navigate("/");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchBooks(keyword, 0, DEFAULT_PAGE_SIZE);
        const books = response?.data?.content || response?.content || [];
        setBookList(Array.isArray(books) ? books : []);
      } catch (err) {
        console.error("Failed to search books:", err);
        setError("Không thể tìm kiếm sách. Vui lòng thử lại sau.");
        setBookList([]);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [keyword, navigate]);

  const handleSearchSubmit = (newKeyword) => {
    if (newKeyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(newKeyword.trim())}`);
    }
  };

  const showEmptyState = !loading && !error && bookList.length === 0;

  return (
    <MainLayout
      showHero={false}
      onSearchSubmit={handleSearchSubmit}
    >
      <main className="mt-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kết quả tìm kiếm cho "{keyword}"
          </h1>
          {!loading && !error && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tìm thấy {bookList.length} kết quả
            </p>
          )}
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tìm kiếm...</p>
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
              Không tìm thấy sách phù hợp với từ khóa "{keyword}".
            </p>
          </div>
        )}

        {!loading && !error && bookList.length > 0 && (
          <BookCarousel books={bookList} title={`Kết quả tìm kiếm`} />
        )}
      </main>
    </MainLayout>
  );
};

export default SearchResults;
