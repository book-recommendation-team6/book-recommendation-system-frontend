"use client"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import BookTable from "../../components/admin/BookTable"
import { Button, Modal, message } from "antd"
import { Plus } from "lucide-react"
import { PATHS } from "../../constant/routePath"
import {getBooks} from "../../services/manageBookService"

// const mockBooks = Array.from({ length: 10 }, (_, i) => ({
//   id: i + 1,
//   title: "We Are Voulhire",
//   author: "Matthew Tysz",
//   genre: "Romance",
//   publisher: "ABCXYZ",
//   uploadDate: "29/10/2025",
// }))

const AdminBooks = () => {
  const navigate = useNavigate()
  const [bookData, setBookData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)

  const fetchBooks = async (page = 0, size = 10) => {
    setLoading(true)
    try {
      const response = await getBooks(page, size);
      console.log("Fetched books:", response);
      
      // Handle response structure from backend
      const content = response.data?.content || response.content || [];
      const total = response.data?.totalElements || response.totalElements || 0;
      
      setBookData(content);
      setPagination(prev => ({
        ...prev,
        total,
        current: page + 1, // AntD uses 1-based, backend uses 0-based
      }));
    } catch (error) {
      console.error("Error fetching books:", error);
      message.error("Không thể tải danh sách sách");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks(0, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1; // Convert to 0-based
    const size = paginationConfig.pageSize;
    setPagination(paginationConfig);
    fetchBooks(page, size);
  }

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

  const filteredBooks = bookData.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors?.some(author => 
        author.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      book.publisher?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginationConfig = {
    ...pagination,
    position: ["bottomCenter"],
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sách`,
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

        <BookTable 
          books={filteredBooks} 
          onEdit={handleEditBook} 
          onDelete={handleDeleteBook}
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
        />
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
