import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryDropdown from './CategoriesDropdown';
import ProfilePopover from './ProfilePopover';
import useAuth from '../hook/useAuth';

const Header = ({
  onAuthClick,
  user,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onGenreSelect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const { isAuthenticated, logout } = useAuth();

  const isSearchControlled = typeof searchValue === 'string';

  const currentSearchValue = useMemo(
    () => (isSearchControlled ? searchValue : internalSearch),
    [isSearchControlled, searchValue, internalSearch]
  );

  const updateSearchValue = (value) => {
    if (isSearchControlled) {
      onSearchChange?.(value);
    } else {
      setInternalSearch(value);
    }
  };

  const triggerSearch = () => {
    const query = (currentSearchValue || '').trim();
    if (onSearchSubmit) {
      onSearchSubmit(query);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerSearch();
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold">Tekbook</h1>
              <p className="text-xs text-gray-400">Books here, stories there</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors">
                Thể loại
                <ChevronDown className="w-4 h-4" />
              </button>
              <CategoryDropdown onSelect={onGenreSelect} />
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm sách..."
                value={currentSearchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={triggerSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => onAuthClick('register')}
                  className="px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                >
                  Đăng kí
                </button>
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <ProfilePopover user={user} logout={logout} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Tìm sách..."
                value={currentSearchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={triggerSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg">
                Thể loại
              </button>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      onAuthClick('register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
                  >
                    Đăng kí
                  </button>
                  <button
                    onClick={() => {
                      onAuthClick('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
                  >
                    Đăng nhập
                  </button>
                </>
              ) : (
                <div className="px-4 py-2">
                  <ProfilePopover user={user} logout={logout} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
