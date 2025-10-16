import React, { useEffect } from "react"
import { Book } from "lucide-react"
import EmptyState from "../../components/account/EmptyState"
import BookCard from "../../components/BookCard"
// import books from "../../data/book"
import useAuth from "../../hook/useAuth"
import { getBookFavorites } from "../../services/bookFavorite"

const FavoritesSection = React.memo(() => {
  // Update later to fetch real data
  const [favoriteBooks, setFavoriteBooks] = React.useState([]);

  const { user } = useAuth();
  useEffect(() => {
    try {
      const fetchData = async () => {
        const booksData = await getBookFavorites(user.id);
        setFavoriteBooks(booksData);
        console.log("Fetched favorite books:", booksData);
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch favorite books:", error);
    }
  }, [])

  // console.log(favoriteBooks);
  if (favoriteBooks.length === 0) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">SÁCH YÊU THÍCH</h2>
        <EmptyState icon={Book} message="Bạn chưa có sách yêu thích nào" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 shrink-0">SÁCH YÊU THÍCH</h2>

      <div
        className="grid gap-3 sm:gap-4 lg:gap-6 pb-4 overflow-y-auto max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-380px)] p-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {favoriteBooks.map((book) => (
          <div key={book.id} className="flex justify-center">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  )
})

FavoritesSection.displayName = "FavoritesSection"
export default FavoritesSection
