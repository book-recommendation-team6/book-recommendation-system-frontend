import React, { useMemo, useCallback, Suspense } from 'react';
import MainLayout from '../layout/MainLayout';
import { Breadcrumb } from 'antd';

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
  // Mock data - would come from API/props in real app
  const book = useMemo(() => ({
    title: 'Mưa đỏ',
    rating: 4.5,
    reviews: '14 Đánh giá',
    category: 'Tiểu thuyết',
    author: 'Chu Lai',
    publisher: 'NXB Quân Đội Nhân Dân',
    publishDate: '9/10/2025',
    cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
    description: `Mưa Đỏ – một tác phẩm của nhà văn Chu Lai – dựa chứng tỏ vào cuộc hành trình nghiệt thở của một dị bộ đội đặc công dầy bản kích trong những năm đánh đập, dẫu trành quy sử chống Mỹ cứu nước. Tác phẩm sắc xanh này nhắc nhở lại những ngày xưa, những ngày mà lòng đứng cảm và tinh yêu quê hương nhiên nhóm trong mỗi nhịp tim.

Những đông cháy của chiến trường trưa đổ giá đếm bờ sông Mê, một bản đồ dày những bi kịch và chiến tranh, nổi tiếng trong cuộc chiến Trị Thiên – Huế. Câu chuyện bát đầu bằng một trận chiến dữ dội, khi đơn vị đặc công đúng mệnh lại bát ngỏ kỷ kẽ để đánh phục kích. Cuộc chiến kết thúc với những trận rung sót khổng bảo giờ để bồ.
Những đông cháy của chiến trường trưa đổ giá đếm bờ sông Mê, một bản đồ dày những bi kịch và chiến tranh, nổi tiếng trong cuộc chiến Trị Thiên – Huế. Câu chuyện bát đầu bằng một trận chiến dữ dội, khi đơn vị đặc công đúng mệnh lại bát ngỏ kỷ kẽ để đánh phục kích. Cuộc chiến kết thúc với những trận rung sót khổng bảo giờ để bồ.
Những đông cháy của chiến trường trưa đổ giá đếm bờ sông Mê, một bản đồ dày những bi kịch và chiến tranh, nổi tiếng trong cuộc chiến Trị Thiên – Huế. Câu chuyện bát đầu bằng một trận chiến dữ dội, khi đơn vị đặc công đúng mệnh lại bát ngỏ kỷ kẽ để đánh phục kích. Cuộc chiến kết thúc với những trận rung sót khổng bảo giờ để bồ.`,
    reviewsList: [
      {
        name: 'Mai Mai',
        date: '06/10/2024',
        rating: 4,
        comment: 'Xem nghiệp 5 năm đam Ứnglinh, thông báo gốt đã bạn gặt, gần như từ đầu, 100 chương khá nghè hoe tình đợt vào tỉnh hay sa không phần này tượng đủ này.',
      },
      {
        name: 'Lan Anh',
        date: '05/10/2024',
        rating: 5,
        comment: 'Cuốn sách rất hay và cảm động. Tôi đã đọc nó trong một ngày và không thể dừng lại.',
      },
      {
        name: 'Hoàng Nam',
        date: '04/10/2024',
        rating: 4,
        comment: 'Nội dung hay nhưng có một số chỗ hơi dài dòng. Nhìn chung vẫn đáng đọc.',
      },
    ],
  }), []);

  const relatedBooks = useMemo(() => [
    {
      id: 1,
      title: 'Tết ở Làng Địa Ngục',
      author: 'Thảo Trang',
      cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
      category: 'recommended',
    },
    {
      id: 2,
      title: 'Chiến Tranh và Hòa Bình',
      author: 'Lev Tolstoy',
      cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
      category: 'recommended',
    },
    {
      id: 3,
      title: 'Đất Rừng Phương Nam',
      author: 'Đoàn Giỏi',
      cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
      category: 'recommended',
    },
    {
      id: 4,
      title: 'Số Đỏ',
      author: 'Vũ Trọng Phụng',
      cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
      category: 'recommended',
    },
    {
      id: 5,
      title: 'Lão Hạc',
      author: 'Nam Cao',
      cover: 'https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg',
      category: 'recommended',
    },
  ], []);

  // Event handlers
  const handleRead = useCallback(() => {
    console.log('Start reading:', book.title);
    // Navigate to reader page
  }, [book.title]);

  const handleFavorite = useCallback(() => {
    console.log('Add to favorites:', book.title);
    // Add to favorites logic
  }, [book.title]);

  const handleDownload = useCallback(() => {
    console.log('Download book:', book.title);
    // Download logic
  }, [book.title]);

  const breadcrumbItems = useMemo(() => [
    { title: 'Home' },
    { title: <a href="">Book Detail</a> },
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
                  />
                </Suspense>
              </div>
            </ErrorBoundary>

            {/* Related Books */}
            <ErrorBoundary>
              <Suspense fallback={<div className="text-center py-4">Loading related books...</div>}>
                <RelatedBooks books={relatedBooks} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetail;