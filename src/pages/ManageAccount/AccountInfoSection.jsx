"use client"

// src/components/account/AccountInfoSection.jsx
import React, { useState } from "react"
import AccountTabs from "../../components/account/AccountTab"
import PersonalInfoForm from "../../components/account/PersonalInfoForm"
import { AuthContext } from "../../contexts/AuthContext"
const AccountInfoSection = React.memo(() => {
  const [activeSubTab, setActiveSubTab] = useState("personal")
  const { user } = React.useContext(AuthContext)

  const subTabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "security", label: "Tài khoản và bảo mật" },
  ]

  const handleSubmit = (formData) => {
    console.log("Update user:", formData)
    // Handle form submission logic here
    //Update user data here
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">QUẢN LÍ THÔNG TIN</h2>
      </div>

      <AccountTabs tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === "personal" && <PersonalInfoForm user={user} onSubmit={handleSubmit} />}

      {activeSubTab === "security" && (
        <div className="text-center py-12 text-gray-500">
          <p>Tính năng đang được phát triển</p>
        </div>
      )}
    </div>
  )
})

AccountInfoSection.displayName = "AccountInfoSection"
export default AccountInfoSection
