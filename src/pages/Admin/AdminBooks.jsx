"use client"
import { useState } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import BookTable from "../../components/admin/BookTable"
import { Button } from "antd"
import { Plus } from "lucide-react"
const mockBooks = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: "We Are Voulhire",
  author: "Matthew Tysz",
  genre: "Romance",
  publisher: "ABCXYZ",
  uploadDate: "29/10/2025",
}))

const AdminBooks = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query) => {
    setSearchQuery(query)
    console.log("[v0] Searching books:", query)
  }

  const handleAddBook = () => {
    console.log("[v0] Add new book clicked")
    // TODO: Implement add book modal/form
  }

  const handleEditBook = (bookId) => {
    console.log("[v0] Edit book:", bookId)
    // TODO: Implement edit book modal/form
  }

  const handleDeleteBook = (bookId) => {
    console.log("[v0] Delete book:", bookId)
    // TODO: Implement delete confirmation
  }

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Button
            className="flex items-center "
            onClick={handleAddBook}
            type="primary"
            size="large"
          >
            <Plus className="w-4 h-4" />
            Thêm sách mới
          </Button>
        </div>

        <BookTable books={mockBooks} onEdit={handleEditBook} onDelete={handleDeleteBook} />
      </div>
    </AdminLayout>
  )
}

export default AdminBooks
