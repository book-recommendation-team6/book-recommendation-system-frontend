import React from 'react';

const EmptyState = React.memo(({ icon: Icon, message }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />}
      <p>{message}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
export default EmptyState;