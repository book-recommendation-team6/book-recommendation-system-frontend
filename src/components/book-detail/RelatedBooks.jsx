import React from 'react'
import SectionHeader from '../SectionHeader';
import BookCard from '../BookCard';

const RelatedBooks = React.memo(({ books }) => {
  if (!books || books.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pb-12">
      <SectionHeader title="Sách liên quan" subtitle={true} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
});

RelatedBooks.displayName = 'RelatedBooks';
export default RelatedBooks;