import { Moon, Sun } from "lucide-react"
import { Button } from "antd"
import useTheme from "../../hook/useTheme"

const AdminHeader = ({ title = "ADMIN" }) => {
  const [theme, setTheme] = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...")
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 bg-transparent"
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
