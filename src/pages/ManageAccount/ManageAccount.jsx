import React, { useMemo, useCallback } from 'react';
import { Breadcrumb } from 'antd';
import MainLayout from '../../layout/MainLayout';
import AccountSidebar from '../../components/account/AccountSidebar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../constant/routePath';

const ManageAccount = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  console.log('rerender')
  // Memoized mapping objects for better performance
  const pathToTab = useMemo(() => ({
    [PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE]: 'profile',
    [PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS]: 'favorite-books', 
    [PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING]: 'history-reading',
    [PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT]: 'profile'
  }), []);

  const tabToPath = useMemo(() => ({
    'profile': PATHS.MANAGE_ACCOUNT_REDIRECT.PROFILE,
    'favorite-books': PATHS.MANAGE_ACCOUNT_REDIRECT.FAVORITE_BOOKS,
    'history-reading': PATHS.MANAGE_ACCOUNT_REDIRECT.HISTORY_READING
  }), []);

  // Derive activeTab directly from URL pathname
  const activeTab = pathToTab[pathname] || 'profile';

  const user = useMemo(() => ({
    name: 'Trần Sĩ Cường',
    phone: '0910225538', 
    userId: '#123456789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
  }), []);

  const breadcrumbItems = useMemo(() => [
    { title: 'Trang chủ' },
    { title: 'Quản lí tài khoản' }
  ], []);

  // Simple navigation handler
  const handleTabChange = useCallback((tab) => {
    console.log('Tab changed to:', tab);
    const targetPath = tabToPath[tab];
    if (targetPath && pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [pathname, navigate, tabToPath]);

  return (
    <MainLayout showHero={false}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 shadow-sm">
          <Breadcrumb separator=">" items={breadcrumbItems} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-4 bg-white min-h-[calc(100vh-300px)] shadow-sm rounded-lg">
          <AccountSidebar
            user={user}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="md:col-span-3">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageAccount;