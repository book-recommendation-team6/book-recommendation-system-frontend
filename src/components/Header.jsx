import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryDropdown from './CategoriesDropdown';
import ProfilePopover from './ProfilePopover';
import SearchSuggestions from './SearchSuggestions';
import useAuth from '../hook/useAuth';
import { searchBooks } from '../services/manageBookService';

const Header = ({
  onAuthClick,
  user,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

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

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search is empty, hide suggestions
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set new timeout for autocomplete
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await searchBooks(value.trim(), 0, 5); // Lấy 5 suggestions
        const books = response?.data?.content || response?.content || [];
        const booksArray = Array.isArray(books) ? books : [];
        setSuggestions(booksArray);
        
        // Chỉ hiện dropdown khi có kết quả
        if (booksArray.length > 0) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 1000); // Delay 1 giây
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const triggerSearch = () => {
    const query = (currentSearchValue || '').trim();
    if (onSearchSubmit) {
      onSearchSubmit(query);
      setShowSuggestions(false);
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

  const handleSuggestionSelect = () => {
    setShowSuggestions(false);
    setInternalSearch('');
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
              <CategoryDropdown />
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Tìm sách..."
                value={currentSearchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
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
              
              {/* Search Suggestions */}
              {showSuggestions && (
                <SearchSuggestions
                  suggestions={suggestions}
                  isLoading={isLoadingSuggestions}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              )}
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
