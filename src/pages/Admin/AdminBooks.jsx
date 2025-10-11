import AdminLayout from "../../layout/AdminLayout"

const AdminBooks = () => {
  return (
    <AdminLayout title="ADMIN">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quản lí sách</h2>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-gray-200 dark:border-slate-800">
          <p className="text-gray-600 dark:text-gray-400">Book management interface will be implemented here.</p>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBooks
