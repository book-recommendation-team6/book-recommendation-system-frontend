import React from "react";

const Hero = () => {
  return (
    <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop')"
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px] opacity-20"/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          THƯ VIỆN Ở TRONG TẦM TAY BẠN
        </h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
          Chào mừng bạn đến với thư viện thân thiện gần gũi. Chúng tôi có hơn
          <span className="font-bold text-yellow-400"> 50.000 ebook </span>
          miễn phí đang chờ bạn khám phá.
        </p>
      </div>
    </div>
  );
};

export default Hero;