import React from 'react';

const ListItem = ({ cover, title, subtitle, right, rightIcon }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={cover}
        alt={title}
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
      />
      <div className="min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">
          {title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-slate-900 dark:text-white font-semibold">
        {right}
      </span>
      {rightIcon}
    </div>
  </div>
);

export default ListItem;