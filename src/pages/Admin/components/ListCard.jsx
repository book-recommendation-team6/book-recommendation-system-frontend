import React from "react";
import ListItem from "./ListItem";
import { Star, Heart } from "lucide-react";

const formatNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }
  return value.toLocaleString("en-US");
};

const ListCard = ({
  title,
  subtitle,
  items,
  variant = "rating",
  isLoading = false,
}) => (
  <div className="rounded-3xl p-4 md:p-5 bg-white/60 dark:bg-slate-900/60 border border-white/70 dark:border-slate-800 shadow-sm">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center md:text-left">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
      {subtitle}
    </p>

    <div className="mt-3 divide-y divide-slate-200/70 dark:divide-slate-800">
      {isLoading ? (
        <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Đang tải dữ liệu...
        </div>
      ) : items.length ? (
        items.map((it) => (
          <ListItem
            key={it.id}
            cover={it.cover}
            title={it.title}
            subtitle={it.subtitle}
            right={
              variant === "rating"
                ? it.score.toFixed(1)
                : formatNumber(it.score)
            }
            rightIcon={
              variant === "rating" ? (
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              ) : (
                <Heart className="h-5 w-5 text-rose-500" />
              )
            }
          />
        ))
      ) : (
        <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Chưa có dữ liệu để hiển thị.
        </div>
      )}
    </div>
  </div>
);

export default ListCard;
