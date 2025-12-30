import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import BookCarousel from "../components/BookCarousel";
import TopBooksShowcase from "../components/TopBooksShowcase";
import SectionHeader from "../components/SectionHeader";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import MainLayout from "../layout/MainLayout";
import { getBooks, getBooksByGenre } from "../services/manageBookService";
import { getRecommendedBooks, getDiversityBooks, getMostReadBooks } from "../services/bookService";
import useAuth from "../hook/useAuth";

const DEFAULT_PAGE_SIZE = 12;

const Home = () => {
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]);
  const [genre1Books, setGenre1Books] = useState([]);
  const [genre2Books, setGenre2Books] = useState([]);
  const [genre3Books, setGenre3Books] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [topBooksLoading, setTopBooksLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDiversity, setShowDiversity] = useState(false);
  const [diversityBooks, setDiversityBooks] = useState([]);
  const [diversityLoading, setDiversityLoading] = useState(false);
  const [diversityError, setDiversityError] = useState(null);
  const [anchorBookId, setAnchorBookId] = useState(null);
  
  const { user } = useAuth();
  const userId = user?.id;
  // Lazy loading states
  const [genre1Loaded, setGenre1Loaded] = useState(false);
  const [genre2Loaded, setGenre2Loaded] = useState(false);
  const [genre3Loaded, setGenre3Loaded] = useState(false);
  
  // Refs to track loaded state (for observer callback closure)
  const genre1LoadedRef = useRef(false);
  const genre2LoadedRef = useRef(false);
  const genre3LoadedRef = useRef(false);
  
  // Refs for intersection observer
  const genre1Ref = useRef(null);
  const genre2Ref = useRef(null);
  const genre3Ref = useRef(null);

  // Sync refs with state
  useEffect(() => { genre1LoadedRef.current = genre1Loaded; }, [genre1Loaded]);
  useEffect(() => { genre2LoadedRef.current = genre2Loaded; }, [genre2Loaded]);
  useEffect(() => { genre3LoadedRef.current = genre3Loaded; }, [genre3Loaded]);

  // Load all books on initial mount
  useEffect(() => {
    const loadAllBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        // Nếu có userId thì lấy sách gợi ý, không thì lấy sách thông thường
        if (userId) {
          response = await getRecommendedBooks(userId, 12);
          console.log("Recommended books in Home:", response);
        } else {
          response = await getBooks(0, 12);
        }

        const books = response?.data || [];
        setAllBooks(Array.isArray(books) ? books : []);
      } catch (error) {
        console.error("Error loading books:", error);
        setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };
    loadAllBooks();
  }, [userId]);
  console.log("All books:", allBooks);

  // Load top books (most read) - separate from recommendations
  useEffect(() => {
    const loadTopBooks = async () => {
      setTopBooksLoading(true);
      try {
        const response = await getMostReadBooks(0, 4);
        const books = response?.data?.content || response?.content || [];
        console.log("Top most read books:", books);
        setTopBooks(Array.isArray(books) ? books : []);
      } catch (error) {
        console.error("Error loading top books:", error);
        setTopBooks([]);
      } finally {
        setTopBooksLoading(false);
      }
    };
    loadTopBooks();
  }, []);

  // Update anchor book when recommendations change
  useEffect(() => {
    if (allBooks.length > 0) {
      setAnchorBookId(allBooks[0]?.id ?? null);
    } else {
      setAnchorBookId(null);
    }

    setDiversityBooks([]);
    setDiversityError(null);
  }, [allBooks]);

  // Load diversity books when toggled on
  useEffect(() => {
    let isActive = true;

    if (!showDiversity) {
      setDiversityLoading(false);
      return () => {
        isActive = false;
      };
    }

    const loadDiversity = async () => {
      if (!showDiversity) return;

      if (!anchorBookId) {
        setDiversityBooks([]);
        setDiversityError("Không tìm thấy sách để đa dạng hóa.");
        setDiversityLoading(false);
        return;
      }

      setDiversityLoading(true);
      setDiversityError(null);

      try {
        const response = await getDiversityBooks(anchorBookId, { limit: 6 });
        if (!isActive) return;

        const payload = response?.data || {};
        const items = Array.isArray(payload.items) ? payload.items : [];
        setDiversityBooks(items);
      } catch (err) {
        if (!isActive) return;
        console.error("Error loading diversity books:", err);
        setDiversityBooks([]);
        setDiversityError("Không thể tải sách đa dạng. Vui lòng thử lại.");
      } finally {
        if (isActive) {
          setDiversityLoading(false);
        }
      }
    };

    loadDiversity();

    return () => {
      isActive = false;
    };
  }, [showDiversity, anchorBookId]);

  // Load books by genre
  const loadGenreBooks = useCallback(async (genreId, setter) => {
    try {
      const response = await getBooksByGenre(genreId, { page: 0, size: DEFAULT_PAGE_SIZE });
      const books = response?.data?.content || response?.content || [];
      setter(Array.isArray(books) ? books : []);
    } catch {
      setter([]);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    // Chỉ khởi tạo observer sau khi load xong allBooks
    if (loading) return;

    const genreConfigs = [
      { ref: genre1Ref, loadedRef: genre1LoadedRef, setter: setGenre1Loaded, genreId: 11, setBooks: setGenre1Books },
      { ref: genre2Ref, loadedRef: genre2LoadedRef, setter: setGenre2Loaded, genreId: 6, setBooks: setGenre2Books },
      { ref: genre3Ref, loadedRef: genre3LoadedRef, setter: setGenre3Loaded, genreId: 9, setBooks: setGenre3Books },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const config = genreConfigs.find((c) => c.ref.current === entry.target);
            if (config && !config.loadedRef.current) {
              config.loadedRef.current = true;
              config.setter(true);
              loadGenreBooks(config.genreId, config.setBooks);
            }
          }
        });
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    // Observe all genre refs
    genreConfigs.forEach((config) => {
      if (config.ref.current) observer.observe(config.ref.current);
    });

    return () => {
      genreConfigs.forEach((config) => {
        if (config.ref.current) observer.unobserve(config.ref.current);
      });
      observer.disconnect();
    };
  }, [loading, loadGenreBooks]);

  const handleSearchSubmit = (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  return (
    <MainLayout
      showHero={true}
      heroContent={<Hero />}
      onSearchSubmit={handleSearchSubmit}
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

        {!loading && !error && (
          <div>
            {/* Features Section */}
            {/* <FeaturesSection /> */}
            
            {/* Top Books Showcase - Most Read Books */}
            {topBooksLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải top sách...</p>
              </div>
            ) : topBooks.length > 0 ? (
              <TopBooksShowcase 
                books={topBooks} 
                title="Top sách được đọc nhiều nhất" 
              />
            ) : null}

            {/* Stats Section */}
            {/* <StatsSection /> */}

            {/* Recommended Books with Diversity toggle */}
            {allBooks.length > 0 && (
              <section className="mb-12">
                <SectionHeader
                  title="SÁCH DÀNH CHO BẠN"
                  subtitle={false}
                  extra={
                    <button
                      onClick={() => setShowDiversity((prev) => !prev)}
                      className="relative flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-blue-950/50"
                    >
                      {diversityLoading && showDiversity && (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent dark:border-blue-200"></span>
                      )}
                      {showDiversity ? "Thu gọn" : "Đa dạng hóa"}
                    </button>
                  }
                />

                <div className="mt-6">
                  {showDiversity ? (
                    <div className="grid gap-8 lg:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Đề xuất dành riêng cho bạn</h3>
                        <BookCarousel books={allBooks} showHeader={false} className="mb-0" />
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Khám phá đa dạng</h3>
                        {diversityLoading ? (
                          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent dark:border-blue-200"></div>
                          </div>
                        ) : diversityError ? (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
                            {diversityError}
                          </div>
                        ) : diversityBooks.length > 0 ? (
                          <BookCarousel books={diversityBooks} showHeader={false} className="mb-0" />
                        ) : (
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                            Chưa có sách đa dạng để hiển thị.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <BookCarousel books={allBooks} showHeader={false} className="mb-0" />
                  )}
                </div>
              </section>
            )}

            {/* Genre 1 Carousel with Lazy Loading */}
            <div ref={genre1Ref} className="min-h-[100px]">
              {genre1Loaded ? (
                genre1Books.length > 0 ? (
                  <BookCarousel 
                    books={genre1Books} 
                    title="TÀI CHÍNH" 
                    genreId={11}
                    genreName="Tài chính"
                    subtitle={true}
                  />
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Không có sách thể loại Tài chính</p>
                  </div>
                )
              ) : (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải thể loại Khoa học...</p>
                </div>
              )}
            </div>

            {/* Genre 2 Carousel with Lazy Loading */}
            <div ref={genre2Ref} className="min-h-[100px]">
              {genre2Loaded ? (
                genre2Books.length > 0 ? (
                  <BookCarousel 
                    books={genre2Books} 
                    title="KỸ NĂNG SỐNG" 
                    genreId={6}
                    genreName="Kỹ năng sống"
                    subtitle={true}
                  />
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Không có sách thể loại Kỹ năng sống</p>
                  </div>
                )
              ) : (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải thể loại Kỹ năng sống...</p>
                </div>
              )}
            </div>

            {/* Genre 3 Carousel with Lazy Loading */}
            <div ref={genre3Ref} className="min-h-[100px]">
              {genre3Loaded ? (
                genre3Books.length > 0 ? (
                  <BookCarousel 
                    books={genre3Books} 
                    title="TIỂU THUYẾT" 
                    genreId={9}
                    genreName="Tiểu thuyết"
                    subtitle={true}
                  />
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Không có sách thể loại Lịch sử</p>
                  </div>
                )
              ) : (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải thể loại Kinh tế...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default Home;
