import React from 'react';
import { Book } from 'lucide-react';
import EmptyState from './EmptyState';

const FavoritesSection = React.memo(({ favorites = [] }) => {
  if (favorites.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">SÁCH YÊU THÍCH</h2>
        <EmptyState icon={Book} message="Bạn chưa có sách yêu thích nào" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">SÁCH YÊU THÍCH</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Map through favorites */}
      </div>
    </div>
  );
});

FavoritesSection.displayName = 'FavoritesSection';
export default FavoritesSection;