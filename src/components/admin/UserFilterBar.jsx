import { Select, Button } from "antd"
import { Filter, X } from "lucide-react"
import { useState } from "react"

const { Option } = Select

const ROLE_OPTIONS = [
  { value: "USER", label: "Người dùng" },
  { value: "ADMIN", label: "Quản trị viên" },
]

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đã kích hoạt" },
  { value: "INACTIVE", label: "Chưa kích hoạt" },
  { value: "BANNED", label: "Bị chặn" },
]

const UserFilterBar = ({ onFilterChange, filters }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleRoleChange = (value) => {
    onFilterChange({ ...filters, role: value })
  }

  const handleStatusChange = (value) => {
    onFilterChange({ ...filters, status: value })
  }

  const handleClearFilters = () => {
    onFilterChange({
      role: undefined,
      status: undefined,
    })
  }

  const hasActiveFilters = filters.role || filters.status

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          icon={<Filter className="w-4 h-4" />}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
        
        {hasActiveFilters && (
          <Button
            icon={<X className="w-4 h-4" />}
            onClick={handleClearFilters}
            danger
            className="flex items-center gap-2"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vai trò
            </label>
            <Select
              placeholder="Chọn vai trò"
              value={filters.role}
              onChange={handleRoleChange}
              className="w-full"
              allowClear
            >
              {ROLE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <Select
              placeholder="Chọn trạng thái"
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
              allowClear
            >
              {STATUS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserFilterBar