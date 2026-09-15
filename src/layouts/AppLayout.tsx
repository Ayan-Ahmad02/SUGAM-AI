import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { MobileNavbar } from '../components/common/MobileNavbar';
import { BottomNav } from '../components/common/BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile Header & Drawer */}
        <MobileNavbar />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Mobile Bottom Dock */}
        <BottomNav />
      </div>
    </div>
  );
};
