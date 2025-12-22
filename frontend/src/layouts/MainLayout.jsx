import React from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';
import FloatingButtons from '../components/common/FloatingButtonsNew';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f2f7f5]">
      <Navbar />
      <FloatingButtons />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
