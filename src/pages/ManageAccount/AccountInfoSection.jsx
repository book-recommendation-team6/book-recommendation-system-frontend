// src/components/account/AccountInfoSection.jsx
import React, { useState, useContext, useEffect } from "react"
import { message } from "antd"
import AccountTabs from "../../components/account/AccountTab"
import PersonalInfoForm from "../../components/account/PersonalInfoForm"
import SecurityForm from "../../components/account/SecurityForm"
import { AuthContext } from "../../contexts/AuthContext"
import { changeUserPassword, updateUserAvatar, updateUserProfile } from "../../services/userService"

const AccountInfoSection = React.memo(() => {
  const [activeSubTab, setActiveSubTab] = useState("personal")
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const { user, loading, fetchUserProfile } = useContext(AuthContext)

  useEffect(() => {
    if (!user && !loading) {
      fetchUserProfile()
    }
  }, [user, loading, fetchUserProfile])

  const subTabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "security", label: "Tài khoản và bảo mật" },
  ]

  const handleSubmit = async (formData) => {
    if (!user) return
    setUpdatingProfile(true)

    try {
      await updateUserProfile(user.id, formData)
      message.success("Cập nhật thông tin thành công")
      await fetchUserProfile()
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Cập nhật thông tin thất bại"
      message.error(errorMessage)
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleAvatarChange = async (file) => {
    if (!user || !file) return
    setUploadingAvatar(true)

    try {
      await updateUserAvatar(user.id, file)
      message.success("Cập nhật ảnh đại diện thành công")
      await fetchUserProfile()
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Cập nhật ảnh đại diện thất bại"
      message.error(errorMessage)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handlePasswordChange = async ({ currentPassword, newPassword }) => {
    if (!user) return
    setChangingPassword(true)

    try {
      await changeUserPassword(user.id, { currentPassword, newPassword })
      message.success("Đổi mật khẩu thành công")
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Đổi mật khẩu thất bại"
      message.error(errorMessage)
      throw error
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading && !user) {
    return <div className="py-10 text-center text-gray-500">Đang tải thông tin tài khoản...</div>
  }

  if (!user) {
    return <div className="py-10 text-center text-gray-500">Không tìm thấy thông tin tài khoản.</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">QUẢN LÍ THÔNG TIN</h2>
      </div>

      <AccountTabs tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === "personal" && (
        <PersonalInfoForm
          user={user}
          onSubmit={handleSubmit}
          onAvatarChange={handleAvatarChange}
          isSubmitting={updatingProfile}
          isUploadingAvatar={uploadingAvatar}
        />
      )}

      {activeSubTab === "security" && (
        <SecurityForm user={user} onChangePassword={handlePasswordChange} isSubmitting={changingPassword} />
      )}
    </div>
  )
})

AccountInfoSection.displayName = "AccountInfoSection"
export default AccountInfoSection
