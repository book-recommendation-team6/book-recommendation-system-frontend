import React from 'react';
import { User, Book, History } from 'lucide-react';
import UserAvatar from './UserAvatar';

const AccountSidebar = React.memo(({ user, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'info', label: 'Quản lí tài khoản', icon: User },
    { id: 'favorites', label: 'Sách yêu thích', icon: Book },
    { id: 'history', label: 'Lịch sử đọc sách', icon: History }
  ];

  return (
    <div className="md:col-span-1">
      <div className="p-6 border-r h-full border-gray-200">
        <div className="text-center mb-6">
          <UserAvatar
            src={user.avatar}
            alt={user.name}
            size="md"
            className="mx-auto mb-3"
          />
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
        </div>

        <nav className="space-y-1 border-t pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? 'bg-gray-slidebar opacity-56 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
});

AccountSidebar.displayName = 'AccountSidebar';
export default AccountSidebar;