import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { QuickViewModal } from './QuickViewModal';
import { SizeGuideModal } from './SizeGuideModal';
import { SearchModal } from './SearchModal';
import { Toast } from './Toast';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F1] text-[#171614] selection:bg-[#B69A70] selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Global Overlays & Drawers */}
      <CartDrawer />
      <QuickViewModal />
      <SizeGuideModal />
      <SearchModal />
      <Toast />
    </div>
  );
};

