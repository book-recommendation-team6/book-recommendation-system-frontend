import { Select } from "antd"

const SortSelect = ({ value, onChange, options, placeholder = "Sắp xếp theo", className = "" }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={`w-full sm:w-48 ${className}`}
      size="large"
    />
  )
}

export default SortSelect
