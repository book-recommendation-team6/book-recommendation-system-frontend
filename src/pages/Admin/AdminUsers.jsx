import { useState, useEffect, useRef } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import StatusFilter from "../../components/admin/StatusFilter"
import SortSelect from "../../components/admin/SortSelect"
import UserTable from "../../components/admin/UserTable"
import { Modal, message } from "antd"
import { getUser, banUser, unbanUser } from "../../services/manageUserService"

const normalizeStatus = (status) => {
  if (!status) {
    return 'UNKNOWN';
  }
  if (typeof status === 'string') {
    return status.trim().toUpperCase();
  }
  if (typeof status === 'object') {
    if (typeof status.name === 'string') {
      return status.name.trim().toUpperCase();
    }
    if (typeof status.value === 'string') {
      return status.value.trim().toUpperCase();
    }
  }
  return 'UNKNOWN';
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const searchInitialized = useRef(false)
  const filterInitialized = useRef(false)

  const fetchUsers = async (page = 0, size = pagination.pageSize, keyword = "") => {
    setLoading(true)
    try {
      const response = await getUser(page, size, keyword)
      const data = response.data || response
      const content = data?.content || []
      const total = data?.totalElements || 0

      let normalizedContent = content.map(user => ({
        ...user,
        status: normalizeStatus(user.status),
      }))

      // Client-side filtering by status
      if (statusFilter) {
        normalizedContent = normalizedContent.filter(user => 
          user.status === statusFilter
        )
      }

      // Client-side sorting
      normalizedContent = sortUsers(normalizedContent, sortBy)

      setUsers(normalizedContent)
      setPagination(prev => ({
        ...prev,
        pageSize: size,
        total: statusFilter ? normalizedContent.length : total,
        current: page + 1, // AntD uses 1-based, backend uses 0-based
      }))
    } catch (error) {
      console.error("Error fetching users:", error)
      message.error("Không thể tải danh sách người dùng")
    } finally {
      setLoading(false)
    }
  }

  const sortUsers = (userList, sortType) => {
    const sorted = [...userList]
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      case "name-asc":
        return sorted.sort((a, b) => (a.username || "").localeCompare(b.username || ""))
      case "name-desc":
        return sorted.sort((a, b) => (b.username || "").localeCompare(a.username || ""))
      case "email-asc":
        return sorted.sort((a, b) => (a.email || "").localeCompare(b.email || ""))
      case "email-desc":
        return sorted.sort((a, b) => (b.email || "").localeCompare(a.email || ""))
      default:
        return sorted
    }
  }

  useEffect(() => {
    fetchUsers(0, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const handler = setTimeout(() => {
      fetchUsers(0, pagination.pageSize, searchQuery)
    }, 400)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    if (!filterInitialized.current) {
      filterInitialized.current = true;
      return;
    }

    fetchUsers(0, pagination.pageSize, searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  useEffect(() => {
    // Re-sort current data when sort option changes
    setUsers(prev => sortUsers(prev, sortBy))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1 // Convert to 0-based
    const size = paginationConfig.pageSize
    fetchUsers(page, size, searchQuery)
  }

  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Handle lock user action
  const handleLockUser = (user) => {
    setSelectedUser(user)
    setIsBanModalOpen(true)
  }

  const confirmBan = async () => {
    if (!selectedUser) {
      return
    }

    try {
      if (selectedUser.status === "BANNED") {
        await unbanUser(selectedUser.id)
        message.success("Bỏ chặn người dùng thành công!")
      } else {
        await banUser(selectedUser.id)
        message.success("Chặn người dùng thành công!")
      }
      setIsBanModalOpen(false)
      setSelectedUser(null)
      fetchUsers(pagination.current - 1, pagination.pageSize, searchQuery)
    } catch (error) {
      message.error("Cập nhật trạng thái người dùng thất bại!")
      console.error("Error updating user status:", error)
    }
  }

  const cancelBan = () => {
    setIsBanModalOpen(false)
    setSelectedUser(null)
  }

  // Pagination configuration for UserTable
  const paginationConfig = {
    ...pagination,
    position: ["bottomCenter"],
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
  }

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "name-asc", label: "Tên A-Z" },
    { value: "name-desc", label: "Tên Z-A" },
    { value: "email-asc", label: "Email A-Z" },
    { value: "email-desc", label: "Email Z-A" },
  ]

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm kiếm..." />
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <SortSelect 
            value={sortBy} 
            onChange={setSortBy} 
            options={sortOptions}
            placeholder="Sắp xếp theo"
          />
        </div>
        
        <UserTable 
          users={users}
          onLockUser={handleLockUser}
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
        />
      </div>

      <Modal
        title={selectedUser?.status === "BANNED" ? "Bỏ chặn người dùng" : "Chặn người dùng"}
        open={isBanModalOpen}
        onOk={confirmBan}
        onCancel={cancelBan}
        okText="Có"
        cancelText="Không"
        okButtonProps={selectedUser?.status === "BANNED" ? {} : { danger: true }}
        centered
      >
        <p>
          {selectedUser?.status === "BANNED"
            ? "Bạn muốn bỏ chặn người dùng này?"
            : "Bạn muốn chặn người dùng này?"}
        </p>
      </Modal>
    </AdminLayout>
  )
}

export default AdminUsers
