"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import GenreFilter from "../../components/admin/GenreFilter"
import SortSelect from "../../components/admin/SortSelect"
import BookTable from "../../components/admin/BookTable"
import { Button, Modal, message } from "antd"
import { Plus, Trash2 } from "lucide-react"
import { PATHS } from "../../constant/routePath"
import { deleteBook as deleteBookApi, deleteBooksBulk, getAdminBooks } from "../../services/manageBookService"

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
  const [selectedGenre, setSelectedGenre] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [selectedBookIds, setSelectedBookIds] = useState([])
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)
  const [pendingBulkIds, setPendingBulkIds] = useState([])
  const searchInitialized = useRef(false)
  const filterInitialized = useRef(false)
  const sortInitialized = useRef(false)

  const fetchBooks = async (
    page = 0,
    size = pagination.pageSize,
    keywordParam = searchQuery,
    genreIdParam = selectedGenre,
    sortParam = sortBy
  ) => {
    setLoading(true)
    try {
      const response = await getAdminBooks({
        page,
        size,
        keyword: keywordParam,
        genreId: genreIdParam,
        sort: sortParam,
      })

      const data = response.data || response;
      const content = data?.content || [];

      setBookData(content);
      setPagination({
        current: (data?.number ?? page) + 1,
        pageSize: data?.size ?? size,
        total: data?.totalElements ?? 0,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      message.error("Không thể tải danh sách sách");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const handler = setTimeout(() => {
      fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre, sortBy);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (!filterInitialized.current) {
      filterInitialized.current = true;
      return;
    }

    fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre]);

  useEffect(() => {
    if (!sortInitialized.current) {
      sortInitialized.current = true;
      return;
    }

    fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1; // Convert to 0-based
    const size = paginationConfig.pageSize;
    fetchBooks(page, size, searchQuery, selectedGenre, sortBy);
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
      if (!bookToDelete) return;

      await deleteBookApi(bookToDelete);
      message.success("Xóa sách thành công!")

      const totalAfterDelete = Math.max(0, pagination.total - 1);
      const maxPageIndex = Math.max(
        0,
        Math.ceil(totalAfterDelete / pagination.pageSize) - 1,
      );
      const currentPageIndex = Math.max(0, pagination.current - 1);
      const nextPage = Math.min(currentPageIndex, maxPageIndex);

      setSelectedBookIds((prev) => prev.filter((id) => id !== bookToDelete))
      await fetchBooks(nextPage, pagination.pageSize, searchQuery, selectedGenre, sortBy);

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

  const handleBookSelectionChange = (selectedKeys) => {
    setSelectedBookIds(selectedKeys)
  }

  const handleBulkDeleteClick = () => {
    if (!selectedBookIds.length) return
    setPendingBulkIds(selectedBookIds)
    setIsBulkDeleteModalOpen(true)
  }

  const confirmBulkDelete = async () => {
    if (!pendingBulkIds.length) {
      return
    }

    try {
      await deleteBooksBulk(pendingBulkIds)
      message.success(`Xóa ${pendingBulkIds.length} sách thành công!`)

      const totalAfterDelete = Math.max(0, pagination.total - pendingBulkIds.length)
      const maxPageIndex = Math.max(
        0,
        Math.ceil(totalAfterDelete / pagination.pageSize) - 1,
      )
      const currentPageIndex = Math.max(0, pagination.current - 1)
      const nextPage = Math.min(currentPageIndex, maxPageIndex)

      await fetchBooks(nextPage, pagination.pageSize, searchQuery, selectedGenre, sortBy)

      setSelectedBookIds([])
      setIsBulkDeleteModalOpen(false)
      setPendingBulkIds([])
    } catch (error) {
      message.error("Xóa sách thất bại!")
      console.error("Error deleting books:", error)
    }
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteModalOpen(false)
    setPendingBulkIds([])
  }

  const paginationConfig = {
    ...pagination,
    position: ["bottomCenter"],
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sách`,
  }

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "title-asc", label: "Tên A-Z" },
    { value: "title-desc", label: "Tên Z-A" },
  ]

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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <GenreFilter value={selectedGenre} onChange={setSelectedGenre} />
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            placeholder="Sắp xếp theo"
          />
        </div>

        {selectedBookIds.length > 0 && (
          <div className="flex justify-end">
            <Button
              danger
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả ({selectedBookIds.length})
            </Button>
          </div>
        )}

        <BookTable
          books={bookData}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
          selectedRowKeys={selectedBookIds}
          onSelectionChange={handleBookSelectionChange}
        />
      </div>

      <Modal
        title="Xóa nhiều sách"
        open={isBulkDeleteModalOpen}
        onOk={confirmBulkDelete}
        onCancel={cancelBulkDelete}
        okText="Đồng ý"
        cancelText="Từ chối"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn muốn xóa {pendingBulkIds.length} sách đã chọn?</p>
      </Modal>

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
