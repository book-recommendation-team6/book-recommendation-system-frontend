import { Select, Button } from "antd"
import { Filter, X } from "lucide-react"
import { useState, useEffect } from "react"
import { getGenres } from "../../services/genreService"

const { Option } = Select

const BookFilterBar = ({ onFilterChange, filters }) => {
  const [genres, setGenres] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { genres: genreList } = await getGenres({ page: 0, size: 100 })
        setGenres(genreList)
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }
    fetchGenres()
  }, [])

  const handleGenreChange = (value) => {
    onFilterChange({ ...filters, genreIds: value })
  }

  const handlePublisherChange = (value) => {
    onFilterChange({ ...filters, publisher: value })
  }

  const handleAuthorChange = (value) => {
    onFilterChange({ ...filters, author: value })
  }

  const handleClearFilters = () => {
    onFilterChange({
      genreIds: [],
      publisher: undefined,
      author: undefined,
    })
  }

  const hasActiveFilters = 
    (filters.genreIds && filters.genreIds.length > 0) ||
    filters.publisher ||
    filters.author

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thể loại
            </label>
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              value={filters.genreIds}
              onChange={handleGenreChange}
              className="w-full"
              allowClear
              maxTagCount="responsive"
            >
              {genres.map((genre) => (
                <Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tác giả
            </label>
            <Select
              placeholder="Nhập tên tác giả"
              value={filters.author}
              onChange={handleAuthorChange}
              className="w-full"
              allowClear
              showSearch
              filterOption={false}
              mode="tags"
              maxTagCount={1}
            >
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhà xuất bản
            </label>
            <Select
              placeholder="Nhập nhà xuất bản"
              value={filters.publisher}
              onChange={handlePublisherChange}
              className="w-full"
              allowClear
              showSearch
              filterOption={false}
              mode="tags"
              maxTagCount={1}
            >
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookFilterBar