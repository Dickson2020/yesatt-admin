import React, { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for mobile (slide over) */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar} />
        <div className="fixed inset-y-0 left-0 w-64 bg-primary">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar for desktop (always visible) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;