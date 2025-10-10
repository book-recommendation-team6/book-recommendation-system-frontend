import React, { useState, useMemo, useCallback } from 'react';
import { Breadcrumb } from 'antd';
import MainLayout from '../layout/MainLayout';
import AccountSidebar from '../components/account/AccountSidebar';
import AccountInfoSection from '../components/account/AccountInfoSection';
import FavoritesSection from '../components/account/FavoritesSection';
import HistorySection from '../components/account/HistorySection';

const ManageAccount = () => {
  const [activeTab, setActiveTab] = useState('info');

  const user = useMemo(() => ({
    name: 'Trần Sĩ Cường',
    phone: '0910225538',
    userId: '#123456789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
  }), []);

  const favorites = useMemo(() => [], []);
  const history = useMemo(() => [], []);

  const breadcrumbItems = useMemo(() => [
    { title: 'Trang chủ' },
    { title: 'Quản lí tài khoản' }
  ], []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleUpdateUser = useCallback((formData) => {
    console.log('Update user data:', formData);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <AccountInfoSection user={user} onUpdateUser={handleUpdateUser} />;
      case 'favorites':
        return <FavoritesSection favorites={favorites} />;
      case 'history':
        return <HistorySection history={history} />;
      default:
        return <AccountInfoSection user={user} onUpdateUser={handleUpdateUser} />;
    }
  };

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
            <div className=" p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageAccount;