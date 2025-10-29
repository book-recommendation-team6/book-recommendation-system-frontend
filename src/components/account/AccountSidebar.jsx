"use client"

import React from "react"
import { User, Book, History } from "lucide-react"
import UserAvatar from "./UserAvatar"

const AccountSidebar = React.memo(({ user, activeTab, onTabChange }) => {
  const menuItems = [
    { id: "profile", label: "Quản lí tài khoản", icon: User },
    { id: "favorite-books", label: "Sách yêu thích", icon: Book },
    { id: "history-reading", label: "Lịch sử đọc sách", icon: History },
  ]

  const avatarSrc = user?.avatarUrl || user?.avatar || ""
  const displayName = user?.fullName || user?.username || user?.email || "Người dùng"

  return (
    <div className="md:col-span-1 h-full">
      <div className="p-4 sm:p-6 md:border-r h-full border-gray-200">
        <div className="text-center mb-4 sm:mb-6">
          <UserAvatar src={avatarSrc} alt={displayName} size="md" className="mx-auto mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{displayName}</h3>
        </div>

        <nav className="space-y-1 border-t pt-3 sm:pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                  isActive ? "bg-gray-sidebar opacity-56 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-semibold">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
})

AccountSidebar.displayName = "AccountSidebar"
export default AccountSidebar
