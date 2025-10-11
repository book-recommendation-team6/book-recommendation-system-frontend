import React, { useState, useRef, useEffect } from 'react';
import { User, Book, History, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { Switch } from "antd";
import useTheme  from '../hook/useTheme';

const ProfilePopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Theme management
  const [theme, setTheme] = useTheme();

  const handleThemeChange = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleMenuClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const menuItems = [
    { icon: User, label: 'Quản lí tài khoản', path: '/manage-account/profile' },
    { icon: Book, label: 'Sách yêu thích', path: '/manage-account/favorite-books' },
    { icon: History, label: 'Lịch sử đọc sách', path: '/manage-account/history-reading' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-800 rounded-full transition-colors"
      >
        <span className="text-sm font-medium hidden md:block">{user?.name || 'Sĩ Cường'}</span>
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
        />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded-lg shadow-xl overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-2 border-b border-gray-700">
            <div className="flex items-center bg-gray-900 gap-3 p-2 rounded-xl">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                alt={user?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-white">{user?.name || 'Sĩ Cường'}</p>
                <p className="text-sm text-gray-400">{user?.email || 'sicuong@gmail.com'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5" />
                <span className="text-sm">Dark Mode</span>
              </div>
              <div className="relative">
                <Switch checked={theme === 'dark'} onChange={handleThemeChange} />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 rounded transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePopover;