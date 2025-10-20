import React from 'react';

const formatNumber = (n) => n.toLocaleString("en-US");

// ====== UI components ngắn gọn ======
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="h-full flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
    <div className="h-12 w-12 rounded-full grid place-items-center bg-[#EEF5FF] dark:bg-slate-800">
      <Icon className="h-6 w-6 text-indigo-500" />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
        {formatNumber(value)}
      </p>
    </div>
  </div>
);


export default StatCard;