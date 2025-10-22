"use client"
import { useState } from "react"
import { ConfigProvider, Button, Flex, Table } from "antd"
import { Pencil, Trash2 } from "lucide-react"

const columns = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Tác giả",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Thể loại",
    dataIndex: "genres",
    key: "genres",
  },
  {
    title: "Nhà xuất bản",
    dataIndex: "publisher",
    key: "publisher",
  },
  {
    title: "Ngày tải lên",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => <span className="text-teal-500 font-medium">{new Date(text).toLocaleDateString()}</span>,
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => record.onEdit(record.id)}
          className="p-2 text-orange-500 hover:bg-orange-50 rounded transition-colors"
          aria-label="Edit book"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => record.onDelete(record.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete book"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    ),
  },
]

const BookTable = ({ books, onEdit, onDelete }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)

  const start = () => {
    setLoading(true)
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const hasSelected = selectedRowKeys.length > 0

  const dataSource = books.map((book) => ({
    ...book,
    key: book.id,
    author: book.authors?.map(a => a.name).join(", ") || "-",   // dùng đúng field "authors"
    genres: book.genres?.map(g => g.name).join(", ") || "-",
    onEdit,
    onDelete,
  }))

  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="middle">
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flex>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#E7E7E7",
            },
          },
        }}
      >
        <Table
          rowSelection={rowSelection}
          pagination={{ position: ["bottomCenter"],  size: "large" }}
          columns={columns}
          dataSource={dataSource}
          size="large"
        />
      </ConfigProvider>
    </Flex>
  )
}

export default BookTable
