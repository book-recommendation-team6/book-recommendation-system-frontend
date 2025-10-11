"use client"

import React, { useMemo } from "react"
import { History } from "lucide-react"
import EmptyState from "../../components/account/EmptyState"
import BookCard from "../../components/BookCard"
import books from "../../data/book"
const HistorySection = React.memo(() => {
  // Update later to fetch real data
  const history = []

  if (books.length === 0) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">LỊCH SỬ ĐỌC SÁCH</h2>
        <EmptyState icon={History} message="Chưa có lịch sử đọc sách" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">LỊCH SỬ ĐỌC SÁCH</h2>
      <div
        className="grid gap-3 sm:gap-4 lg:gap-6 pb-4 overflow-y-auto max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-380px)] p-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {books.map((book) => (
          <div key={book.id} className="flex justify-center">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  )
})

HistorySection.displayName = "HistorySection"
export default HistorySection
