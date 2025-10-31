import { useEffect, useState } from "react"
import { Select } from "antd"
import { getGenres } from "../../services/genreService"

const GenreFilter = ({ value, onChange, className = "" }) => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true)
      try {
        const response = await getGenres({ page: 0, size: 100 })
        setGenres(response.genres || [])
      } catch (error) {
        console.error("Error fetching genres:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  const options = [
    { value: "", label: "Tất cả thể loại" },
    ...genres.map(genre => ({
      value: genre.id,
      label: genre.name
    }))
  ]

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      loading={loading}
      placeholder="Lọc theo thể loại"
      className={`w-full sm:w-48 ${className}`}
      size="large"
    />
  )
}

export default GenreFilter
