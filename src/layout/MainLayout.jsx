import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children, showHero = false, heroContent = null }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {showHero && heroContent}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;