import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Star, Heart, Download, Section } from "lucide-react";
import { Breadcrumb } from "antd";
import SectionHeader from "../components/SectionHeader";
import BookCard from "../components/BookCard";

const BookDetail = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const relatedBooks = [
    {
      id: 1,
      title: "Tết ở Làng Địa Ngục",
      author: "Thảo Trang",
      cover:
        "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
      category: "recommended",
    },
    {
      id: 2,
      title: "Tết ở Làng Địa Ngục",
      author: "Thảo Trang",
      cover:
        "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
      category: "recommended",
    },
    {
      id: 22,
      title: "Tết ở Làng Địa Ngục",
      author: "Thảo Trang",
      cover:
        "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
      category: "recommended",
    },
    {
      id: 23,
      title: "Tết ở Làng Địa Ngục",
      author: "Thảo Trang",
      cover:
        "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
      category: "recommended",
    },
    {
      id: 24,
      title: "Tết ở Làng Địa Ngục",
      author: "Thảo Trang",
      cover:
        "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
      category: "recommended",
    },
  ];

  // Example book data - would come from props or API
  const book = {
    title: "Mưa đỏ",
    rating: 4.5,
    reviews: "14 Đánh giá",
    category: "Chu Lai",
    author: "Tiểu thuyết",
    publisher: "NXB Quân Đội Nhân Dân",
    publishDate: "9/10/2025",
    cover:
      "https://tiemsach.org/wp-content/uploads/2023/09/Tet-o-lang-dia-nguc.jpg",
    description: `Mưa Đỏ – một tác phẩm của nhà văn Chu Lai – dựa chứng tỏ vào cuộc hành trình nghiệt thở của một dị bộ đội đặc công dầy bản kích trong những năm đánh đập, dẫu trành quy sử chống Mỹ cứu nước. Tác phẩm sắc xanh này nhắc nhở lại những ngày xưa, những ngày mà lòng đứng cảm và tinh yêu quê hương nhiên nhóm trong mỗi nhịp tim.

Những đông cháy của chiến trường trưa đổ giá đếm bờ sông Mê, một bản đồ dày những bi kịch và chiến tranh, nổi tiếng trong cuộc chiến Trị Thiên – Huế. Câu chuyện bát đầu bằng một trận chiến dữ dội, khi đơn vị đặc công đúng mệnh lại bát ngỏ kỷ kẽ để đánh phục kích. Cuộc chiến kết thúc với những trận rung sót khổng bảo giờ để bồ. Họ biết rằng cuộc chiến này vạo là bó phải chiến đầu sự tự dữ vạo để đốc lập cơ quể hướng. Họ dễ vượt qua mọi khó khăn để hoàn thành nhiệm vụ điềm giảo, để đem lại hy vọng và tự do cho đất nước yêu đấu.

Một lần nữa, một dội quân kiên cường bước phải đối mất với số đời kinh hủng, cận bệnh, và sự khan hiếm của dân đơn cứu. Họ phải cầm trong vai mỏ bước di chuyện trải sư trựt súng phục kích của xa thù.

Tuy nhiên, những tất cả những khó khăn, thách thức, và bắt tởi, nhóm liên đạc công này không bao giở từ bồ. Họ biết rằng cuộc chiến này vạo là bố phải chiến đầu sự tử dữ vạo để đốc lập cơ quể hướng. Họ dễ vượt qua mọi khó khăn để hoàn thành nhiệm vụ điềm giảo, để đem lại hy vọng và tự do cho đất nước yêu đầu.

Các nhân vật trong tác phẩm này bắt đầu từ thượng úy Phượng, người chỉ huy đảy tài năng và bản lính một đơn vị. Những người linh ảo gốm trung úy Mai, một người phủ nữ qua cảm và bắt khuất, cũng với anh thợ mộc gần đỏ. Những nhân vặt này đổ tập một sái cờ hạnh mỏi, sẵn sáng hy sinh bản thân vì quết hường và tự vơ.

Ý nghĩa của cuốn tiểu thuyết này là một sự kính trọng và tri ân đối với những người linh dũng cảm ấy quế hướng. Đây là một lời kể về những cuộc dấu tranh vì những mất tầm lồng đồng cảm, đại diện cho sự sinh và tính thân chiến đấu của nhân dân Việt Nam trong cuộc chiến tranh đối lại đây cảm gỏ. Mưa Đỏ là một câu chuyện nảo hùng về tình yêu quế hướng, khát vọng tự do và sở vỏ sự kiễn trì trong cuộc chiến đấu vì những giá trị cao quý.`,
  };

  return (
    <MainLayout showHero={false}>
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 shadow-sm">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: "Home",
              },
              {
                title: <a href="">Book Detail</a>,
              }
            ]}
          />
        </div>
      </div>

      {/* Book Detail Content */}
      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-4 ">
          <div className="bg-white shadow-sm p-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Book Cover - Made Sticky */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full max-w-72 mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Book Info */}
              <div className="lg:col-span-3">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {book.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(book.rating)
                            ? "fill-current"
                            : "stroke-current"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{book.reviews}</span>
                </div>

                {/* Book Details Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="w-32 font-semibold text-gray-700">
                        Tác giả:
                      </span>
                      <span className="text-gray-600">{book.category}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-semibold text-gray-700">
                        Thể loại:
                      </span>
                      <span className="text-gray-600">{book.author}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="w-36 font-semibold text-gray-700">
                        Nhà xuất bản:
                      </span>
                      <span className="text-gray-600">{book.publisher}</span>
                    </div>
                    <div className="flex">
                      <span className="w-36 font-semibold text-gray-700">
                        Ngày phát hành:
                      </span>
                      <span className="text-gray-600">{book.publishDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                  <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold">
                    Bắt đầu Đọc
                  </button>
                  <button className="p-3 border border-primary bg-secondary/56 bg- rounded-full  hover:bg-secondary-hover/35 transition-colors">
                    <Heart className="w-6 h-6 text-primary" />
                  </button>
                  <button className="p-3 border border-primary bg-secondary/56 rounded-full hover:bg-secondary-hover/35 transition-colors">
                    <Download className="w-6 h-6 text-primary" />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <SectionHeader title="Giới thiệu sách" />
                  <div className="p-6 rounded-lg">
                    <div className="text-sm text-gray-700 leading-relaxed text-justify space-y-4">
                      <div className="whitespace-pre-line">
                        {showFullDescription 
                          ? book.description 
                          : book.description.substring(0, 800) + "..."
                        }
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-primary hover:text-primary-hover font-medium transition-colors duration-200 inline-flex items-center gap-1"
                        >
                          {showFullDescription 
                            ? (
                              <>
                                Thu gọn
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </>
                            ) 
                            : (
                              <>
                                Xem thêm
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            )
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating & Reviews Section */}
                <div className="border-t border-gray-300 pt-8">
                  <SectionHeader title="Đánh giá & Nhận xét" />

                  <div className="grid grid-cols-1 ">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8 p-4 bg-gray-100 border border-gray-300 rounded-xl ">
                      {/* Rating Summary */}
                      <div className="lg:col-span-1">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-gray-900 mb-2">
                            {book.rating}
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            {book.reviews}
                          </div>
                        </div>
                      </div>
                      {/* Rating Breakdown */}
                      <div className="lg:col-span-5">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div
                              key={stars}
                              className="flex items-center gap-4"
                            >
                              <div className="flex flex-1 text-yellow-400 text-xs justify-end">
                                {[...Array(stars)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3 fill-current"
                                  />
                                ))}
                              </div>
                              <div className="flex-5 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width:
                                      stars === 5
                                        ? "60%"
                                        : stars === 4
                                        ? "25%"
                                        : "5%",
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="w-full lg:col-start-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                        Viết đánh giá
                      </button>
                    </div>
                    {/* Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                      {[
                        {
                          name: "Mai Mai",
                          date: "06/10/2024",
                          rating: 4,
                          comment:
                            "Xem nghiệp 5 năm đam Ứnglinh, thông báo gốt đã bạn gặt, gần như từ đầu, 100 chương khá nghè hoe tình đợt vào tỉnh hay sa không phần này tượng đủ này, từ phần cuốn hiểu bám nhóm thể khó phần không tớ của 24 của 3 cảm gì ô truyện kịch. Những ch chô tôn kết up, chấp ít nghệ nấy về chí đến là đủ truyện lại.",
                        },
                        {
                          name: "Mai Mai",
                          date: "06/10/2024",
                          rating: 4,
                          comment:
                            "Xem nghiệp 5 năm đam Ứnglinh, thông báo gốt đã bạn gặt, gần như từ đầu, 100 chương khá nghè hoe tình đợt vào tỉnh hay sa không phần này tượng đủ này, từ phần cuốn hiểu bám nhóm thể khó phần không tớ của 24 của 3 cảm gì ô truyện kịch. Những ch chô tôn kết up, chấp ít nghệ nấy về chí đến là đủ truyện lại.",
                        },
                        {
                          name: "Mai Mai",
                          date: "06/10/2024",
                          rating: 4,
                          comment:
                            "Xem nghiệp 5 năm đam Ứnglinh, thông báo gốt đã bạn gặt, gần như từ đầu, 100 chương khá nghè hoe tình đợt vào tỉnh hay sa không phần này tượng đủ này, từ phần cuốn hiểu bám nhóm thể khó phần không tớ của 24 của 3 cảm gì ô truyện kịch. Những ch chô tôn kết up, chấp ít nghệ nấy về chí đến là đủ truyện lại.",
                        },
                      ].map((review, index) => (
                        <div
                          key={index}
                          className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 bg-gray-100 p-4 rounded-xl"
                        >
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
                            M
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="font-semibold text-gray-900">
                                {review.name}
                              </span>
                              <div className="flex flex-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-current"
                                        : "stroke-current"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="text-center pt-4">
                        <button className="bg-gray-200 text-black rounded-2xl font-medium py-2 px-4 hover:bg-gray-300 transition-colors">
                          Xem thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="container mx-auto px-4 pb-12">
              <SectionHeader title="Sách liên quan" subtitle={true} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {relatedBooks.map((book, index) => (
                  <BookCard book={book} />
                ))}
              </div>
            </div>
          </div>
          {/* Related Books */}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetail;
