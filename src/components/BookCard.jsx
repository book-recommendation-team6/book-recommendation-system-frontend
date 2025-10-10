import React from 'react';
import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="flex-shrink-0 w-48 cursor-pointer " onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 group">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2 text-sm truncate">
        {book.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 flex gap-2"><Pen size={16}/> {book.author}</p>
    </div>
  );
};

export default BookCard;