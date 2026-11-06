import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../common/Toast';
import { BackToTop } from '../common/BackToTop';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-warmWhite text-bagodi-text overflow-x-hidden relative">
      {/* Top Header Region (Distinct from page content below) */}
      <div className="w-full relative z-40">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Content (Begins cleanly below navbar without overlap) */}
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      <Footer />

      {/* Global Overlays & Floating Widgets */}
      <CartDrawer />
      <ToastContainer />
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
};
