import { Select } from "antd"

const StatusFilter = ({ value, onChange, className = "" }) => {
  const options = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "BANNED", label: "Bị chặn" },
  ]

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Lọc theo trạng thái"
      className={`w-full sm:w-48 ${className}`}
      size="large"
    />
  )
}

export default StatusFilter
