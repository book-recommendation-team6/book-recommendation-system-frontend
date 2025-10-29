import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGenres } from "../services/genreService";

const CategoryDropdown = ({ onSelect }) => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryClick = (category) => {
    if (onSelect) {
      onSelect(category);
      return;
    }

    navigate(`/category/${category.id}?name=${encodeURIComponent(category.name)}`);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      try {
        const { genres } = await getGenres({ size: 100 });
        setGenres(genres);
      } catch (error) {
        console.error("Không thể tải danh sách thể loại:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const columns = useMemo(() => {
    if (!genres.length) {
      return [];
    }

    const columnCount = 3;
    const result = Array.from({ length: columnCount }, () => []);

    genres.forEach((genre, index) => {
      result[index % columnCount].push(genre);
    });

    return result;
  }, [genres]);

  return (
    <div className="absolute pointer-events-none group-hover:pointer-events-auto top-full left-0 mt-0 pt-2 bg-transparent z-50 min-w-96">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl py-4 transition-all duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0 transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100">
        <div className="px-4 pb-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Sách</h3>
        </div>
        
        <div className="py-4 px-4">
          {isLoading ? (
            <div className="px-2 py-6 text-center text-sm text-gray-400">
              Đang tải thể loại...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {onSelect && (
                <div className="col-span-3 mb-2">
                  <button
                    onClick={() => onSelect(null)}
                    className="w-full text-left py-1 transition-colors text-sm text-blue-300 hover:text-blue-200"
                  >
                    Tất cả sách
                  </button>
                </div>
              )}
              {columns.length ? (
                columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-2">
                    {column.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleCategoryClick(item)}
                        className="w-full text-left py-1 transition-colors text-sm text-gray-300 hover:text-blue-300"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-sm text-gray-400">
                  Chưa có thể loại nào để hiển thị.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="px-4 pt-2 border-t border-gray-700">
          <button 
            onClick={() => navigate('/categories')}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium py-2"
          >
            Xem thêm →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
