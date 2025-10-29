import { useMemo, useCallback, useContext, useState } from "react"
import { Breadcrumb } from "antd"
import MainLayout from "../../layout/MainLayout"
import AccountSidebar from "../../components/account/AccountSidebar"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { PATHS } from "../../constant/routePath"
import { AuthContext } from "../../contexts/AuthContext"
import { Menu, X } from "lucide-react"
import {Link} from "react-router-dom"

const ManageAccount = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  console.log("rerender")

  const pathToTab = useMemo(
    () => ({
      [PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE]: "profile",
      [PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS]: "favorite-books",
      [PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING]: "history-reading",
      [PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT]: "profile",
    }),
    [],
  )

  const tabToPath = useMemo(
    () => ({
      profile: PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE,
      "favorite-books": PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS,
      "history-reading": PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING,
    }),
    [],
  )

  //Active tab for Sidebar
  const activeTab = pathToTab[pathname] || "profile"

  // Tab labels for breadcrumb
  const tabLabels = useMemo(
    () => ({
      profile: "Thông tin tài khoản",
      "favorite-books": "Sách yêu thích",
      "history-reading": "Lịch sử đọc sách",
    }),
    [],
  )

  const breadcrumbItems = useMemo(
    () => [
      { 
        title: <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Trang chủ</Link>
      }, 
      { 
        title: <span className="text-gray-800 font-medium">Quản lí tài khoản</span>
      },
      { 
        title: <span className="text-gray-800 font-medium">{tabLabels[activeTab]}</span>
      }
    ],
    [activeTab, tabLabels],
  )

  const handleTabChange = useCallback(
    (tab) => {
      console.log("Tab changed to:", tab)
      const targetPath = tabToPath[tab]
      if (targetPath && pathname !== targetPath) {
        navigate(targetPath)
        setIsMobileSidebarOpen(false)
      }
    },
    [pathname, navigate, tabToPath],
  )

  const handleSearchSubmit = useCallback((keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
    }
  }, [navigate]);

  return (
    <MainLayout showHero={false} onSearchSubmit={handleSearchSubmit}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-3 sm:p-4 shadow-sm">
          <Breadcrumb separator=">" items={breadcrumbItems} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white shadow-sm rounded-lg relative">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden fixed bottom-6 right-6 z-50 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {isMobileSidebarOpen && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileSidebarOpen(false)} />
          )}

          <div className="md:grid md:grid-cols-4 min-h-[calc(100vh-250px)] md:min-h-[calc(100vh-300px)]">
            <div
              className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 md:w-auto
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 md:col-span-1
                bg-white md:bg-transparent
              `}
            >
              <AccountSidebar user={user} activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            <div className="md:col-span-3">
              <div className="p-4 sm:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ManageAccount
