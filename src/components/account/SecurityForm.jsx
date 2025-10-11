"use client"

// src/components/account/SecurityForm.jsx
import React, { useState } from "react"

const SecurityForm = React.memo(({ user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePasswordClick = () => {
    setShowChangePassword(!showChangePassword)
  }

  const handleSubmitPassword = (e) => {
    e.preventDefault()
    console.log("Change password:", passwordData)
    // Handle password change logic here
  }

  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={user.email || ""}
          disabled
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
        <input
          type="password"
          value="••••••••••"
          disabled
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-sm sm:text-base"
        />
      </div>

      <button
        onClick={handleChangePasswordClick}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
      >
        Đổi mật khẩu
      </button>

      {showChangePassword && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thay đổi mật khẩu</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitPassword}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
            >
              Xác nhận
            </button>
            <button
              onClick={handleChangePasswordClick}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

SecurityForm.displayName = "SecurityForm"
export default SecurityForm
