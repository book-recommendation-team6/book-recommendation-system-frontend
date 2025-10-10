import React from 'react';
import { History } from 'lucide-react';
import EmptyState from './EmptyState';

const HistorySection = React.memo(({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">LỊCH SỬ ĐỌC SÁCH</h2>
        <EmptyState icon={History} message="Chưa có lịch sử đọc sách" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">LỊCH SỬ ĐỌC SÁCH</h2>
      <div className="space-y-4">
        {/* Map through history */}
      </div>
    </div>
  );
});

HistorySection.displayName = 'HistorySection';
export default HistorySection;