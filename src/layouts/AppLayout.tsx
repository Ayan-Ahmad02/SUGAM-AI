import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { MobileNavbar } from '../components/common/MobileNavbar';
import { BottomNav } from '../components/common/BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F8]">
      {/* Desktop Top Header (Full Width) */}
      <div className="hidden lg:block sticky top-0 z-40">
        <Header />
      </div>

      {/* Mobile Header & Drawer */}
      <MobileNavbar />

      {/* Main Workspace Row with Left Sidebar */}
      <div className="flex-1 flex min-w-0">
        {/* Desktop Persistent Left Sidebar */}
        <Sidebar />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <BottomNav />
    </div>
  );
};
