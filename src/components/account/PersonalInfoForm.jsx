"use client"

// src/components/account/PersonalInfoForm.jsx
import React, { useState } from "react"
import UserAvatar from "./UserAvatar"

const PersonalInfoForm = React.memo(({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    userId: user.id,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChangeAvatar = () => {
    console.log("Change avatar")
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 sm:gap-8">
      <div className="order-first md:order-last md:col-span-1 flex flex-col items-center">
        <UserAvatar src={user.avatar} alt={user.name} size="lg" className="mb-3 sm:mb-4" />
        <button
          onClick={handleChangeAvatar}
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          Thay ảnh
        </button>
      </div>

      <div className="order-last md:order-first md:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Id người dùng</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            disabled
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm sm:text-base"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full md:w-auto px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm sm:text-base"
        >
          Cập nhật
        </button>
      </div>
    </div>
  )
})

PersonalInfoForm.displayName = "PersonalInfoForm"
export default PersonalInfoForm
