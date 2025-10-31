import { Table } from "antd"
import { Pencil, Trash2 } from "lucide-react"

const GenreTable = ({ genres, onEdit, onDelete, pagination, onTableChange, loading }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => text || <span className="text-gray-400 italic">Chưa có mô tả</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(record)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <Table
        columns={columns}
        dataSource={genres}
        rowKey="id"
        pagination={pagination}
        onChange={onTableChange}
        loading={loading}
        scroll={{ x: 800 }}
        className="custom-table"
      />
    </div>
  )
}

export default GenreTable
