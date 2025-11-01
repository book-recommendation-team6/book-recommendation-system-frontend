import { useState, useEffect, useRef } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import StatusFilter from "../../components/admin/StatusFilter"
import SortSelect from "../../components/admin/SortSelect"
import UserTable from "../../components/admin/UserTable"
import { Button, Modal, message } from "antd"
import { getUser, banUser, unbanUser, banUsersBulk } from "../../services/manageUserService"
import { Ban } from "lucide-react"

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
  const sortInitialized = useRef(false)

  const fetchUsers = async (
    page = 0,
    size = pagination.pageSize,
    keywordParam = searchQuery,
    statusParam = statusFilter,
    sortParam = sortBy
  ) => {
    setLoading(true)
    try {
      const response = await getUser(page, size, keywordParam, statusParam, sortParam)
      const data = response.data || response
      const content = data?.content || []

      const normalizedContent = content.map(user => ({
        ...user,
        status: normalizeStatus(user.status),
      }))

      setUsers(normalizedContent)
      setPagination({
        current: (data?.number ?? page) + 1,
        pageSize: data?.size ?? size,
        total: data?.totalElements ?? 0,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      message.error("Không thể tải danh sách người dùng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(0, pagination.pageSize, searchQuery, statusFilter, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const handler = setTimeout(() => {
      fetchUsers(0, pagination.pageSize, searchQuery, statusFilter, sortBy)
    }, 400)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    if (!filterInitialized.current) {
      filterInitialized.current = true;
      return;
    }

    fetchUsers(0, pagination.pageSize, searchQuery, statusFilter, sortBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  useEffect(() => {
    if (!sortInitialized.current) {
      sortInitialized.current = true;
      return;
    }

    fetchUsers(0, pagination.pageSize, searchQuery, statusFilter, sortBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1 // Convert to 0-based
    const size = paginationConfig.pageSize
    fetchUsers(page, size, searchQuery, statusFilter, sortBy)
  }

  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [isBulkBanModalOpen, setIsBulkBanModalOpen] = useState(false)
  const [pendingBulkUserIds, setPendingBulkUserIds] = useState([])

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
      setSelectedUserIds((prev) => prev.filter((id) => id !== selectedUser.id))
      fetchUsers(pagination.current - 1, pagination.pageSize, searchQuery, statusFilter, sortBy)
    } catch (error) {
      message.error("Cập nhật trạng thái người dùng thất bại!")
      console.error("Error updating user status:", error)
    }
  }

  const cancelBan = () => {
    setIsBanModalOpen(false)
    setSelectedUser(null)
  }

  const handleUserSelectionChange = (selectedKeys) => {
    setSelectedUserIds(selectedKeys)
  }

  const handleBulkBanClick = () => {
    if (!selectedUserIds.length) return
    setPendingBulkUserIds(selectedUserIds)
    setIsBulkBanModalOpen(true)
  }

  const confirmBulkBan = async () => {
    if (!pendingBulkUserIds.length) {
      return
    }

    try {
      await banUsersBulk(pendingBulkUserIds)
      message.success(`Chặn ${pendingBulkUserIds.length} người dùng thành công!`)
      setIsBulkBanModalOpen(false)
      setPendingBulkUserIds([])
      setSelectedUserIds([])
      fetchUsers(pagination.current - 1, pagination.pageSize, searchQuery, statusFilter, sortBy)
    } catch (error) {
      message.error("Chặn người dùng thất bại!")
      console.error("Error banning users:", error)
    }
  }

  const cancelBulkBan = () => {
    setIsBulkBanModalOpen(false)
    setPendingBulkUserIds([])
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
        
        {selectedUserIds.length > 0 && (
          <div className="flex justify-end">
            <Button
              type="primary"
              danger
              onClick={handleBulkBanClick}
              className="flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              Chặn tất cả ({selectedUserIds.length})
            </Button>
          </div>
        )}

        <UserTable
          users={users}
          onLockUser={handleLockUser}
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
          selectedRowKeys={selectedUserIds}
          onSelectionChange={handleUserSelectionChange}
        />
      </div>

      <Modal
        title="Chặn nhiều người dùng"
        open={isBulkBanModalOpen}
        onOk={confirmBulkBan}
        onCancel={cancelBulkBan}
        okText="Có"
        cancelText="Không"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn muốn chặn {pendingBulkUserIds.length} người dùng đã chọn?</p>
      </Modal>

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
