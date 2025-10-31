"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import GenreFilter from "../../components/admin/GenreFilter"
import SortSelect from "../../components/admin/SortSelect"
import BookTable from "../../components/admin/BookTable"
import { Button, Modal, message } from "antd"
import { Plus } from "lucide-react"
import { PATHS } from "../../constant/routePath"
import { getBooks, searchBooks, deleteBook as deleteBookApi, getBooksByGenre } from "../../services/manageBookService"

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
  const searchInitialized = useRef(false)
  const filterInitialized = useRef(false)

  const fetchBooks = async (page = 0, size = pagination.pageSize, keyword = "", genreId = "") => {
    setLoading(true)
    try {
      const trimmedKeyword = (keyword ?? "").trim()
      let response;
      
      // Priority: search > genre filter > all books
      if (trimmedKeyword) {
        response = await searchBooks(trimmedKeyword, page, size)
      } else if (genreId) {
        response = await getBooksByGenre(genreId, page, size)
      } else {
        response = await getBooks(page, size)
      }
      
      console.log("Fetched books:", response);
      
      const data = response.data || response;
      let content = data?.content || [];
      const total = data?.totalElements || 0;
      
      // Client-side sorting
      content = sortBooks(content, sortBy);
      
      setBookData(content);
      setPagination(prev => ({
        ...prev,
        pageSize: size,
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

  const sortBooks = (books, sortType) => {
    const sorted = [...books];
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0));
      case "oldest":
        return sorted.sort((a, b) => (a.publicationYear || 0) - (b.publicationYear || 0));
      case "title-asc":
        return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "title-desc":
        return sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      case "rating":
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      default:
        return sorted;
    }
  }

  useEffect(() => {
    fetchBooks(0, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const handler = setTimeout(() => {
      fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (!filterInitialized.current) {
      filterInitialized.current = true;
      return;
    }

    fetchBooks(0, pagination.pageSize, searchQuery, selectedGenre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre]);

  useEffect(() => {
    // Re-sort current data when sort option changes
    setBookData(prev => sortBooks(prev, sortBy));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1; // Convert to 0-based
    const size = paginationConfig.pageSize;
    fetchBooks(page, size, searchQuery, selectedGenre);
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

      await fetchBooks(nextPage, pagination.pageSize, searchQuery, selectedGenre);

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

        <BookTable 
          books={bookData} 
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
