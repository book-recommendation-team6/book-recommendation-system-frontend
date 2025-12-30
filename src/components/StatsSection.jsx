import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      value: "10,000+",
      label: "Đầu sách",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500"
    },
    {
      value: "50+",
      label: "Thể loại",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500"
    },
    {
      value: "5,000+",
      label: "Độc giả",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500"
    },
    {
      value: "95%",
      label: "Hài lòng",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="mb-16">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
        <div className="rounded-3xl bg-white dark:bg-gray-900">
          <div className="px-6 py-12 lg:px-12">
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                Con số ấn tượng
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Được tin tưởng bởi hàng ngàn độc giả trên toàn quốc
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative text-center"
                >
                  {/* Icon with gradient */}
                  <div className="mb-4 flex justify-center">
                    <div className={`rounded-full bg-gradient-to-br ${stat.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className={`mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-4xl font-bold text-transparent`}>
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
