import React from 'react';
import { useNavigate } from 'react-router-dom';

function SectionHeader(props) {
    const { title, subtitle, genreId, genreName } = props;
    const navigate = useNavigate();

    const handleViewAll = (e) => {
        e.preventDefault();
        if (genreId) {
            // Navigate to category page with genre ID and name
            navigate(`/category/${genreId}?name=${encodeURIComponent(genreName || title)}`);
        }
    };

    return (
         <div className="w-full mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-medium text-gray-800 dark:text-white mb-2">{title}</h1>
                    <div className="w-32 h-1 bg-red-500 rounded-t-2xl"></div>
                </div>
                {subtitle && (
                    <button 
                        onClick={handleViewAll}
                        className="text-gray-600 dark:text-gray-400 text-sm hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Xem tất cả
                    </button>
                )}
            </div>
            <hr className="text-gray-200"/>
        </div>
    );
}

export default SectionHeader;