import { useState, useEffect } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import UserTable from "../../components/admin/UserTable"
import { Modal, message } from "antd"
import { getUser } from "../../services/manageUserService"

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)

  console.log("AdminUsers rendered. Current users:", users);
  const fetchUsers = async (page = 0, size = 10) => {
    setLoading(true)
    try {
      const response = await getUser(page, size);
      console.log("Fetched users:", response);
      
      // Assuming backend returns { data: { content: [...], totalElements: N } }
      const content = response.data?.content || response.content || [];
      const total = response.data?.totalElements || response.totalElements || 0;
      
      setUsers(content);
      setPagination(prev => ({
        ...prev,
        total,
        current: page + 1, // AntD uses 1-based, backend uses 0-based
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(0, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (paginationConfig) => {
    const page = paginationConfig.current - 1; // Convert to 0-based
    const size = paginationConfig.pageSize;
    setPagination(paginationConfig);
    fetchUsers(page, size);
  }

  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [userToBan, setUserToBan] = useState(null)

  // Handle lock user action
  const handleLockUser = (userId) => {
    setUserToBan(userId)
    setIsBanModalOpen(true)
  }

  const confirmBan = async () => {
    try {
      // await banUserAPI(userToBan);
      console.log("Ban user:", userToBan)
      message.success("Chặn người dùng thành công!")
      setIsBanModalOpen(false)
      setUserToBan(null)
    } catch (error) {
      message.error("Chặn người dùng thất bại!")
      console.error("Error banning user:", error)
    }
  }

  const cancelBan = () => {
    setIsBanModalOpen(false)
    setUserToBan(null)
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id?.toString().includes(searchQuery),
  )

  // Pagination configuration for UserTable
  const paginationConfig = {
    ...pagination,
    position: ["bottomCenter"],
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
  }

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm kiếm..." />
        <UserTable 
          users={filteredUsers} 
          onLockUser={handleLockUser} 
          pagination={paginationConfig}
          onTableChange={handleTableChange}
          loading={loading}
        />
      </div>

      <Modal
        title="Chặn người dùng"
        open={isBanModalOpen}
        onOk={confirmBan}
        onCancel={cancelBan}
        okText="Có"
        cancelText="Không"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn muốn chặn người dùng này?</p>
      </Modal>
    </AdminLayout>
  )
}

export default AdminUsers
