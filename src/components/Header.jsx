import React, { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import CategoryDropdown from './CategoriesDropdown';

const Header = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Tekbook</h1>
              <p className="text-xs text-gray-400">Books here, stories there</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1 max-w-2xl mx-8">
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Thể loại
                <ChevronDown className="w-4 h-4" />
              </button>
              <CategoryDropdown isOpen={categoryOpen} onClose={() => setCategoryOpen(false)} />
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm sách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors">
              Đăng kí
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2">
              Đăng nhập
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm sách..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg">
                Thể loại
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg">
                Đăng kí
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg">
                Đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
