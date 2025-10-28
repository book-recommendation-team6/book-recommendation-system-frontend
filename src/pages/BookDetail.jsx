
import React, { useMemo, useCallback, Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { Breadcrumb } from 'antd';
import scrollToTop from '../utils/scrollToTop';
import {Link} from "react-router-dom";
import useAuth from '../hook/useAuth';
import { useMessage } from '../contexts/MessageProvider';
import { getBookFavorites, addFavorite, removeFavorite } from '../services/bookFavorite';
import { getBooks } from '../services/manageBookService';
import { useParams } from "react-router-dom";
import { getBookDetail } from '../services/manageBookService';

// // Import all the new components
const BookCover = React.lazy(() => import('../components/book-detail/BookCover'));
const BookInfo = React.lazy(() => import('../components/book-detail/BookInfo'));
const RelatedBooks = React.lazy(() => import('../components/book-detail/RelatedBooks'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BookDetail Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600">Vui lòng thử lại sau.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const BookDetail = () => {

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const message = useMessage();
  
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  
  scrollToTop();

  //Get book ID from URL params
  const { id } = useParams();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const favorites = await getBookFavorites(user.id);
          // Check if current book is in favorites list
          const isFav = favorites.some(fav => 
            (fav.bookId === parseInt(book.id)) || (fav.book?.id === parseInt(book.id))
          );
          setIsFavorited(isFav);
        } catch (error) {
          console.error('Failed to check favorite status:', error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [isAuthenticated, user?.id, book.id]);

  // // Event handlers
  // const handleRead = useCallback(() => {
  //   console.log('Start reading:', book.title);
  // State for book detail and related books
  const [bookData, setBookData] = React.useState(null);
  const [relatedBooks, setRelatedBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  console.log("book data:", bookData);
  // Fetch book detail by ID
  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await getBookDetail(id);
        setBookData(response);
      } catch (error) {
        console.error("Failed to fetch book detail:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetail();
  }, [id]);

  // Fetch related books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks(0, 10);
        // console.log("Fetched books for book detail page:", response);
        setRelatedBooks(response.data?.content || response.content || []);
      } catch (error) {
        console.error("Failed to fetch books for book detail page:", error);
      }
    };
    fetchBooks();
  }, []);



  // Use bookData from API or fallback to default
  const book = useMemo(() => {
    if (!bookData) {
      return null;
    }
    
    return {
      id: bookData.id,
      title: bookData.title || 'Không có tiêu đề',
      rating: bookData.averageRating || 0,
      reviews: `${bookData.totalReviews || 0} Đánh giá`,
      category: bookData.genres?.map(g => g.name).join(', ') || 'Chưa phân loại',
      authors: bookData.authors?.map(a => a.name).join(', ') || 'Không rõ tác giả',
      publisher: bookData.publisher || 'Không rõ NXB',
      publishDate: bookData.publicationYear || 'Không rõ',
      cover: bookData.coverImageUrl || 'https://via.placeholder.com/300x400',
      description: bookData.description || 'Chưa có mô tả',
      reviewsList: bookData.reviews || [],
    };
  }, [bookData]);


  // // Event handlers
  const handleRead = () => {
    // console.log('Start reading:', book.title);
    // Navigate to reader page with book ID
    navigate(`/reader`, { state: { src: bookData.formats[1].contentUrl } });
  }

  const handleFavorite = useCallback(async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    // Prevent double click
    if (loadingFavorite) return;
    
    setLoadingFavorite(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        await removeFavorite(user.id, book.id);
        setIsFavorited(false);
        message.success('Đã xóa khỏi yêu thích');
      } else {
        // Add to favorites
        await addFavorite(user.id, book.id);
        setIsFavorited(true);
        message.success('Đã thêm vào yêu thích');
      }
    } catch (error) {
      console.error('Favorite action failed:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoadingFavorite(false);
    }
  }, [book.id, isFavorited, isAuthenticated, user?.id, loadingFavorite, message]);
  // const handleFavorite = useCallback(() => {
  //   console.log('Add to favorites:', book.title);
  //   // Add to favorites logic
  // }, [book.title]);

  // const handleDownload = useCallback(() => {
  //   console.log('Download book:', book.title);
  //   // Download logic
  // }, [book.title]);

  const breadcrumbItems = useMemo(() => [
    { title: <Link to="/">Trang chủ</Link> },
    { title: <p>Chi tiết sách</p> },
  ], []);

  return (
    <MainLayout showHero={false}>
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 shadow-sm">
          <Breadcrumb separator=">" items={breadcrumbItems} />
        </div>
      </div>

      {/* Book Detail Content */}
      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white shadow-sm p-8 space-y-16">
            {/* Main Book Detail */}
            <ErrorBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                  <BookCover src={book.cover} alt={book.title} />
                  <BookInfo
                    book={book}
                    onRead={handleRead}
                    onFavorite={handleFavorite}
                    onDownload={handleDownload}
                    isFavorited={isFavorited}
                    loadingFavorite={loadingFavorite}
                  />
                </Suspense>
                </div>
              </ErrorBoundary>
              
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="mt-4 text-gray-600">Đang tải thông tin sách...</p>
              </div>
            )}

            {/* Error State - No book found */}
            {!loading && !book && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sách</h2>
                <p className="text-gray-600">Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              </div>
            )}

            {/* Main Book Detail */}
            {!loading && book && (
              <ErrorBoundary>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                    <BookCover src={book.cover} alt={book.title} />
                    <BookInfo
                      book={book}
                      onRead={handleRead}
                      // onFavorite={handleFavorite}
                      // onDownload={handleDownload}
                    />
                  </Suspense>
                </div>
              </ErrorBoundary>
            )}

            {/* Related Books */}
            {!loading && book && (
              <ErrorBoundary>
                <Suspense fallback={<div className="text-center py-4">Loading related books...</div>}>
                  <RelatedBooks books={relatedBooks} />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetail;