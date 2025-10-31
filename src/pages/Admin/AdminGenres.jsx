"use client"
import { useState, useEffect, useRef } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import GenreTable from "../../components/admin/GenreTable"
import { Button, Modal, Form, Input, message } from "antd"
import { Plus } from "lucide-react"
import { getGenres, createGenre, updateGenre, deleteGenre } from "../../services/genreService"

const { TextArea } = Input

const AdminGenres = () => {
  const [genres, setGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const searchInitialized = useRef(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingGenre, setEditingGenre] = useState(null)
  const [genreToDelete, setGenreToDelete] = useState(null)
  const [form] = Form.useForm()

  const fetchGenres = async (
    page = pagination.current - 1,
    size = pagination.pageSize,
    keyword = searchQuery
  ) => {
    setLoading(true)
    try {
      const response = await getGenres({ page, size, keyword })
      const pageData = response.page
      const genreList = pageData?.content ?? response.genres ?? []

      setGenres(genreList)
      setPagination({
        current: (pageData?.number ?? page) + 1,
        pageSize: pageData?.size ?? size,
        total: pageData?.totalElements ?? genreList.length,
      })
    } catch (error) {
      console.error("Error fetching genres:", error)
      message.error("Không thể tải danh sách thể loại")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGenres(0, pagination.pageSize, searchQuery)
  }, [])

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true
      return
    }

    const handler = setTimeout(() => {
      fetchGenres(0, pagination.pageSize, searchQuery)
    }, 400)

    return () => clearTimeout(handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1
    const size = paginationConfig.pageSize
    fetchGenres(page, size, searchQuery)
  }

  const handleAddGenre = () => {
    setEditingGenre(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditGenre = (genre) => {
    setEditingGenre(genre)
    form.setFieldsValue({
      name: genre.name,
      description: genre.description || "",
    })
    setIsModalOpen(true)
  }

  const handleDeleteGenre = (genreId) => {
    setGenreToDelete(genreId)
    setIsDeleteModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingGenre) {
        await updateGenre(editingGenre.id, values)
        message.success("Cập nhật thể loại thành công!")
      } else {
        await createGenre(values)
        message.success("Thêm thể loại mới thành công!")
      }
      
      setIsModalOpen(false)
      form.resetFields()
      setEditingGenre(null)
      fetchGenres(pagination.current - 1, pagination.pageSize, searchQuery)
    } catch (error) {
      if (error.errorFields) {
        // Validation error
        return
      }
      message.error(editingGenre ? "Cập nhật thể loại thất bại!" : "Thêm thể loại thất bại!")
      console.error("Error saving genre:", error)
    }
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setEditingGenre(null)
  }

  const confirmDelete = async () => {
    try {
      if (!genreToDelete) return

      await deleteGenre(genreToDelete)
      message.success("Xóa thể loại thành công!")
      setIsDeleteModalOpen(false)
      setGenreToDelete(null)
      fetchGenres(pagination.current - 1, pagination.pageSize, searchQuery)
    } catch (error) {
      message.error("Xóa thể loại thất bại!")
      console.error("Error deleting genre:", error)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setGenreToDelete(null)
  }

  const paginationConfig = {
    ...pagination,
    position: ["bottomCenter"],
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thể loại`,
  }

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Tìm kiếm thể loại..."
          />
          <Button
            onClick={handleAddGenre}
            type="primary"
            size="large"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm thể loại mới</span>
            <span className="sm:hidden">Thêm thể loại</span>
          </Button>
        </div>

        <GenreTable 
          genres={genres}
          onEdit={handleEditGenre}
          onDelete={handleDeleteGenre}
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingGenre ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingGenre ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        centered
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label="Tên thể loại"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên thể loại!" },
              { max: 50, message: "Tên thể loại không được quá 50 ký tự!" },
            ]}
          >
            <Input 
              placeholder="Nhập tên thể loại" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 500, message: "Mô tả không được quá 500 ký tự!" },
            ]}
          >
            <TextArea
              placeholder="Nhập mô tả cho thể loại (tùy chọn)"
              rows={4}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xóa thể loại"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Đồng ý"
        cancelText="Từ chối"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn muốn xóa thể loại này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </AdminLayout>
  )
}

export default AdminGenres
