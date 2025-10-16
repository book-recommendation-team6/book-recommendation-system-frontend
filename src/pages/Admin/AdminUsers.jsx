import { useState } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import UserTable from "../../components/admin/UserTable"
import { Modal, message } from "antd"

// Sample data - replace with actual API call
const sampleUsers = Array(20)
  .fill(null)
  .map((_, index) => ({
    key: index,
    id: index + 1,
    name: "Kristin Watson",
    userId: "#12345",
    email: "michelle.rivera@example.com",
    createdDate: "25/9/2025",
    status: "Đang hoạt động",
    avatar: "/placeholder-user.jpg",
  }))

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(sampleUsers)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [userToBan, setUserToBan] = useState(null)

  const handleLockUser = (userId) => {
    setUserToBan(userId)
    setIsBanModalOpen(true)
  }

  const confirmBan = async () => {
    try {
      // TODO: Add API call to ban user
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.includes(searchQuery),
  )

  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm kiếm..." />

        <UserTable users={filteredUsers} onLockUser={handleLockUser} />
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
