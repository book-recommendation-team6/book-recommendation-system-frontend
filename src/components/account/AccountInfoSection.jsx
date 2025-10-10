// src/components/account/AccountInfoSection.jsx
import React, { useState } from 'react';
import AccountTabs from './AccountTab';
import PersonalInfoForm from './PersonalInfoForm';

const AccountInfoSection = React.memo(({ user, onUpdateUser }) => {
  const [activeSubTab, setActiveSubTab] = useState('personal');

  const subTabs = [
    { id: 'personal', label: 'Thông tin cá nhân' },
    { id: 'security', label: 'Tài khoản và bảo mật' }
  ];

  const handleSubmit = (formData) => {
    console.log('Update user:', formData);
    onUpdateUser(formData);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">QUẢN LÍ THÔNG TIN</h2>
      </div>

      <AccountTabs
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />

      {activeSubTab === 'personal' && (
        <PersonalInfoForm user={user} onSubmit={handleSubmit} />
      )}

      {activeSubTab === 'security' && (
        <div className="text-center py-12 text-gray-500">
          <p>Tính năng đang được phát triển</p>
        </div>
      )}
    </div>
  );
});

AccountInfoSection.displayName = 'AccountInfoSection';
export default AccountInfoSection;