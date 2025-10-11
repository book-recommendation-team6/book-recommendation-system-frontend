import { useState } from "react"
import AdminLayout from "../../layout/AdminLayout"
import SearchBar from "../../components/admin/SearchBar"
import UserTable from "../../components/admin/UserTable"

// Sample data - replace with actual API call
const sampleUsers = Array(10)
  .fill(null)
  .map((_, index) => ({
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

  const handleLockUser = (userId) => {
    console.log("Locking user:", userId)
    // Add lock user logic here
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
    </AdminLayout>
  )
}

export default AdminUsers
