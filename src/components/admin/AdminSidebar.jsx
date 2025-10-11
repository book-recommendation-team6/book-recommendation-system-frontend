import { Link, useLocation } from "react-router-dom"
import { Home, Book, Users } from "lucide-react"

const AdminSidebar = () => {
  const location = useLocation()

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/books", label: "Quản lí sách", icon: Book },
    { path: "/admin/users", label: "Quản lí người dùng", icon: Users },
  ]

  return (
    <aside className="w-48 bg-[#1e293b] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
        <span className="text-white font-semibold text-lg">Tekbook</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar