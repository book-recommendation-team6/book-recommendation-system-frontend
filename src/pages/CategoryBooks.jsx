import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import BookCard from "../components/BookCard";
import { getGenres } from "../services/genreService";
import { getBooksByGenre } from "../services/manageBookService";

const BOOKS_PER_PAGE = 12;

const CategoryBooks = () => {

  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategoryName = searchParams.get("name") || "Thể loại";
  
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [genreName, setGenreName] = useState(initialCategoryName);
  const [genreDescription, setGenreDescription] = useState("");
  const [genresLoading, setGenresLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGenreInfo = async () => {
      setGenresLoading(true);
      try {
        const { genres } = await getGenres({ size: 200 });
        const matchedGenre = genres.find(
          (genre) => String(genre.id) === String(categoryId),
        );

        if (matchedGenre) {
          setGenreName(matchedGenre.name);
          setGenreDescription(matchedGenre.description || "");
        } else {
          setGenreName(initialCategoryName);
          setGenreDescription("");
        }
      } catch (error) {
        console.error("Không thể tải thông tin thể loại:", error);
        setGenreName(initialCategoryName);
        setGenreDescription("");
      } finally {
        setGenresLoading(false);
      }
    };
    
    // Scroll to top when category changes
    window.scrollTo(0, 0);
    fetchGenreInfo();
  }, [categoryId, initialCategoryName]);

  const fetchBooksByCategory = useCallback(async (page = 1) => {
    if (!categoryId) return;

    const pageIndex = Math.max(0, page - 1);

    setBooksLoading(true);
    try {
      const response = await getBooksByGenre(categoryId, {
        page: pageIndex,
        size: BOOKS_PER_PAGE,
        sort: sortBy,
      });

      const data = response?.data || response;
      const content = data?.content || [];
      const total = data?.totalElements ?? content.length;
      const totalPagesCalculated = Math.max(1, Math.ceil(total / BOOKS_PER_PAGE));

      if (page > totalPagesCalculated) {
        setTotalBooks(total);
        setBooks([]);
        setCurrentPage(totalPagesCalculated);
        return;
      }

      setBooks(Array.isArray(content) ? content : []);
      setTotalBooks(total);
    } catch (error) {
      console.error("Không thể tải sách theo thể loại:", error);
      setBooks([]);
      setTotalBooks(0);
    } finally {
      setBooksLoading(false);
    }
  }, [categoryId, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
    setBooks([]);
    setTotalBooks(0);
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) {
      setBooks([]);
      setTotalBooks(0);
      return;
    }
    fetchBooksByCategory(currentPage);
  }, [categoryId, sortBy, currentPage, fetchBooksByCategory]);

  const currentBooks = books;
  const totalPages = Math.max(1, Math.ceil(totalBooks / BOOKS_PER_PAGE));

  const handleSearchSubmit = useCallback((keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
    }
  }, [navigate]);

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <MainLayout onSearchSubmit={handleSearchSubmit}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Trang chủ
              </a>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {genreName}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {genreName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {genresLoading || booksLoading ? (
                    "Đang tải thông tin thể loại..."
                  ) : (
                    <>
                      {genreDescription && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {genreDescription}
                        </span>
                      )}
                      Tìm thấy{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {totalBooks}
                      </span>{" "}
                      cuốn sách
                    </>
                  )}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sắp xếp:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="title-asc">Tên sách (A-Z)</option>
                  <option value="title-desc">Tên sách (Z-A)</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lọc nhanh:</span>
                <button className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  Miễn phí
                </button>
                <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Đánh giá cao
                </button>
                <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Bestseller
                </button>
              </div>
            </div>
          </div>

          {/* Books Grid/List */}
          {booksLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải sách...</p>
            </div>
          ) : currentBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có sách trong thể loại này
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vui lòng quay lại sau hoặc khám phá các thể loại khác
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {currentBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={book.coverImageUrl || "/placeholder.svg"}
                          alt={book.title}
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <a href={`/books/${book.id}`}>{book.title}</a>
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {book.authors?.map(a => a.name).join(", ") || "Không rõ tác giả"}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {book.averageRating !== undefined && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{book.averageRating.toFixed(1)}</span>
                              </div>
                            )}
                            <span>•</span>
                            <span>{book.genres?.map(g => g.name).join(", ") || "Chưa phân loại"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    ← Trước
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryBooks;
