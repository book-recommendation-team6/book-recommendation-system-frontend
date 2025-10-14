"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import BookTable from "../../components/admin/BookTable"
import { Button, Modal, message } from "antd"
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleAddBook = () => {
    navigate(PATHS.ADMIN.ADD_BOOK)
  }

  const handleEditBook = (bookId) => {
    navigate(`${PATHS.ADMIN.EDIT_BOOK.replace(':id', bookId)}`)
  }

  const handleDeleteBook = (bookId) => {
    setBookToDelete(bookId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      // TODO: Add API call to delete book
      // await deleteBookAPI(bookToDelete);
      console.log("Delete book:", bookToDelete)
      message.success("Xóa sách thành công!")
      setIsDeleteModalOpen(false)
      setBookToDelete(null)
    } catch (error) {
      message.error("Xóa sách thất bại!")
      console.error("Error deleting book:", error)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setBookToDelete(null)
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

      <Modal
        title="Xóa sách"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Đồng ý"
        cancelText="Từ chối"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn muốn xóa sách này?</p>
      </Modal>
    </AdminLayout>
  )
}

export default AdminBooks
