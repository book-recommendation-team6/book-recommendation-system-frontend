"use client"

// src/components/account/PersonalInfoForm.jsx
import React, { useEffect, useRef, useState } from "react"
import UserAvatar from "./UserAvatar"

const PersonalInfoForm = React.memo(({ user, onSubmit, onAvatarChange, isSubmitting, isUploadingAvatar }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phoneNumber: user?.phoneNumber || "",
    avatarUrl: user?.avatarUrl || "",
    fullName: user?.fullName || "",
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      avatarUrl: user?.avatarUrl || "",
      fullName: user?.fullName || "",
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const handleChangeAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      onAvatarChange?.(file)
    }
    event.target.value = ""
  }

  const avatarSrc = formData.avatarUrl || user?.avatarUrl || user?.avatar || ""
  const displayName = user?.fullName || user?.username || user?.email || "Người dùng"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:grid md:grid-cols-3 gap-6 sm:gap-8">
      <div className="order-first md:order-last md:col-span-1 flex flex-col items-center">
        <UserAvatar src={avatarSrc} alt={displayName} size="lg" className="mb-3 sm:mb-4" />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={handleChangeAvatar}
          disabled={isUploadingAvatar}
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          {isUploadingAvatar ? "Đang cập nhật..." : "Thay ảnh"}
        </button>
      </div>

      <div className="order-last md:order-first md:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Id người dùng</label>
          <input
            type="text"
            name="userId"
            value={user?.id || ""}
            disabled
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm sm:text-base disabled:opacity-60"
        >
          {isSubmitting ? "Đang lưu..." : "Cập nhật"}
        </button>
      </div>
    </form>
  )
})

PersonalInfoForm.displayName = "PersonalInfoForm"
export default PersonalInfoForm
