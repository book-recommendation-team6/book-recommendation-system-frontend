"use client"
import { Pen } from "lucide-react"
import { useNavigate } from "react-router-dom"

const BookCard = ({ book }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/books/${book.id}`)
  }

  return (
    <div className="min-w-[180px] w-[180px] cursor-pointer flex-shrink-0" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 group">
        <img src={book.coverImageUrl || "/placeholder.svg"} alt={book.title} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-800 dark:text-white line-clamp-2 text-sm">{book.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 flex gap-2 items-center">
        <Pen size={14} className="flex-shrink-0" />
        <span className="truncate">{book.authors?.map(a => a.name).join(", ") || "-"}</span>
      </p>
    </div>
  )
}

export default BookCard;
