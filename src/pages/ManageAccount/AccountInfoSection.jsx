// src/components/account/AccountInfoSection.jsx
import React, { useState } from "react"
import AccountTabs from "../../components/account/AccountTab"
import PersonalInfoForm from "../../components/account/PersonalInfoForm"
import SecurityForm from "../../components/account/SecurityForm"
import { AuthContext } from "../../contexts/AuthContext"
import { updateUserProfile } from "../../services/userService"
import {updateAuthUser} from "../../utils/storage"

const AccountInfoSection = React.memo(() => {
  const [activeSubTab, setActiveSubTab] = useState("personal")
  const { user } = React.useContext(AuthContext)

  const subTabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "security", label: "Tài khoản và bảo mật" },
  ]

  const handleSubmit = async (formData) => {
    console.log("Update user:", formData)
    try{
      const userNewInfor = await updateUserProfile(user.id, formData)
      console.log("User updated successfully:", userNewInfor)
      updateAuthUser(userNewInfor)
    } catch (error) {
      console.error("Failed to update user:", error)
    }
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

      {activeSubTab === "security" && <SecurityForm user={user} />}
    </div>
  )
})

AccountInfoSection.displayName = "AccountInfoSection"
export default AccountInfoSection
