import AdminLayout from "../../layout/AdminLayout"

const AdminDashboard = () => {
  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,234</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">567</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">892</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">45</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
