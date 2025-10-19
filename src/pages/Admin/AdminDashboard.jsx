import AdminLayout from "../../layout/AdminLayout";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import {
  Users,
  BookOpen,
  Layers,
  PenSquare,
  Star,
  Heart,
} from "lucide-react";

const data = [
  { date: "10/8", value: 1900 },
  { date: "11/8", value: 2600 },
  { date: "12/8", value: 2000 },
  { date: "13/8", value: 600 },
  { date: "14/8", value: 2500 },
  { date: "15/8", value: 1700 },
  { date: "16/8", value: 1700 },
];

const formatNumber = (n) => n.toLocaleString("en-US");

// ===== Dummy data cho 2 bảng =====
const topRatedBooks = [
  {
    id: 1,
    title: "Jesse Thomas",
    subtitle: "637 đánh giá",
    cover: "https://picsum.photos/seed/book1/56/56",
    score: 5.0,
  },
  {
    id: 2,
    title: "Thisal Mathiyazhagan",
    subtitle: "600 đánh giá",
    cover: "https://picsum.photos/seed/book2/56/56",
    score: 5.0,
  },
  {
    id: 3,
    title: "Helen Chuang",
    subtitle: "500 đánh giá",
    cover: "https://picsum.photos/seed/book3/56/56",
    score: 5.0,
  },
  {
    id: 4,
    title: "Thisal Mathiyazhagan",
    subtitle: "350 đánh giá",
    cover: "https://picsum.photos/seed/book4/56/56",
    score: 5.0,
  },
  {
    id: 5,
    title: "Thisal Mathiyazhagan",
    subtitle: "300 đánh giá",
    cover: "https://picsum.photos/seed/book5/56/56",
    score: 5.0,
  },
];

const topFavoriteBooks = [
  {
    id: 11,
    title: "Jesse Thomas",
    subtitle: "637 lượt yêu thích",
    cover: "https://picsum.photos/seed/book11/56/56",
    score: 100,
  },
  {
    id: 12,
    title: "Thisal Mathiyazhagan",
    subtitle: "600 lượt yêu thích",
    cover: "https://picsum.photos/seed/book12/56/56",
    score: 100,
  },
  {
    id: 13,
    title: "Helen Chuang",
    subtitle: "500 lượt yêu thích",
    cover: "https://picsum.photos/seed/book13/56/56",
    score: 100,
  },
  {
    id: 14,
    title: "Thisal Mathiyazhagan",
    subtitle: "350 lượt yêu thích",
    cover: "https://picsum.photos/seed/book14/56/56",
    score: 100,
  },
  {
    id: 15,
    title: "Thisal Mathiyazhagan",
    subtitle: "300 lượt yêu thích",
    cover: "https://picsum.photos/seed/book15/56/56",
    score: 100,
  },
];

// ====== UI components ngắn gọn ======
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="h-full flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
    <div className="h-12 w-12 rounded-full grid place-items-center bg-[#EEF5FF] dark:bg-slate-800">
      <Icon className="h-6 w-6 text-indigo-500" />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
        {formatNumber(value)}
      </p>
    </div>
  </div>
);

const ListItem = ({ cover, title, subtitle, right, rightIcon }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={cover}
        alt={title}
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
      />
      <div className="min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">
          {title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-slate-900 dark:text-white font-semibold">
        {right}
      </span>
      {rightIcon}
    </div>
  </div>
);

const ListCard = ({ title, subtitle, items, variant = "rating" }) => (
  <div className="rounded-3xl p-4 md:p-5 bg-white/60 dark:bg-slate-900/60 border border-white/70 dark:border-slate-800 shadow-sm">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center md:text-left">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
      {subtitle}
    </p>

    <div className="mt-3 divide-y divide-slate-200/70 dark:divide-slate-800">
      {items.map((it) => (
        <ListItem
          key={it.id}
          cover={it.cover}
          title={it.title}
          subtitle={it.subtitle}
          right={
            variant === "rating" ? it.score.toFixed(1) : formatNumber(it.score)
          }
          rightIcon={
            variant === "rating" ? (
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            ) : (
              <Heart className="h-5 w-5 text-rose-500" />
            )
          }
        />
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <AdminLayout title="ADMIN">
      <div className="rounded-3xl p-6 md:p-8 bg-[#F4F7FF] dark:bg-slate-950/30">
        <h2 className="text-3xl font-semibold text-indigo-900 dark:text-white mb-6">
          Thống kê
        </h2>

        {/* Hàng 1: 4 ô thống kê + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="grid grid-cols-2 grid-rows-2 auto-rows-fr col-span-2 gap-6 h-full">
            <StatCard icon={Users} label="Tổng số người đọc" value={1000} />
            <StatCard icon={BookOpen} label="Tổng số sách" value={900} />
            <StatCard icon={Layers} label="Tổng số danh mục" value={42} />
            <StatCard icon={PenSquare} label="Tổng số tác giả" value={120} />
          </div>

          <div className="lg:col-span-2 h-full">
            <div className="h-full rounded-3xl p-4 md:p-5 bg-white/60 dark:bg-slate-900/60 border border-white/70 dark:border-slate-800 shadow-sm">
              <div className="text-slate-700 dark:text-slate-200 font-medium mb-3">
                Người dùng mới trong 7 ngày qua
              </div>
              <div className="h-56 md:h-64 rounded-2xl bg-[#F3F6FF] dark:bg-slate-800 p-3 md:p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 24, right: 12, left: 8, bottom: 0 }}
                    barCategoryGap={24}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#334155", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v) => formatNumber(v)}
                      labelFormatter={(l) => `Ngày ${l}`}
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow:
                          "0 6px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                      }}
                      cursor={false}
                      wrapperStyle={{ zIndex: 50 }}
                    />
                    <defs>
                      <linearGradient id="mint" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4AD8C7" />
                        <stop offset="100%" stopColor="#39C1B0" />
                      </linearGradient>
                      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.18" />
                      </filter>
                    </defs>
                    <Bar
                      dataKey="value"
                      fill="url(#mint)"
                      radius={[12, 12, 12, 12]}
                      maxBarSize={42}
                      style={{ filter: "url(#soft)" }}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        formatter={formatNumber}
                        style={{ fontSize: 12, fill: "#0f172a" }}
                        offset={8}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng 2: 2 bảng danh sách */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListCard
            title="Top sách được đánh giá cao"
            subtitle="Các đầu sách được đánh giá cao nhất:"
            items={topRatedBooks}
            variant="rating"
          />
          <ListCard
            title="Top sách được yêu thích nhất"
            subtitle="Các đầu sách được yêu thích nhất:"
            items={topFavoriteBooks}
            variant="favorite"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
