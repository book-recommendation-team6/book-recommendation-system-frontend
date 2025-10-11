"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import BookTable from "../../components/admin/BookTable"
import { Button } from "antd"
import { Plus } from "lucide-react"
import { PATHS } from "../../constant/routePath"

const mockBooks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: "We Are Voulhire",
  author: "Matthew Tysz",
  genre: "Romance",
  publisher: "ABCXYZ",
  uploadDate: "29/10/2025",
}))

const AdminBooks = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleAddBook = () => {
    navigate(PATHS.ADMIN.ADD_BOOK)
  }

  const handleEditBook = (bookId) => {
    console.log("Edit book:", bookId)
  }

  const handleDeleteBook = (bookId) => {
    console.log("Delete book:", bookId)
  }

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <SearchBar value={searchQuery} onChange={handleSearch} />
          <Button
            onClick={handleAddBook}
            type="primary"
            size="large"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm sách mới</span>
            <span className="sm:hidden">Thêm sách</span>
          </Button>
        </div>

        <BookTable books={mockBooks} onEdit={handleEditBook} onDelete={handleDeleteBook} />
      </div>
    </AdminLayout>
  )
}

export default AdminBooks
