import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper function to get page title based on current path
  const getPageInfo = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your business metrics and performance',
        };
      case '/products':
        return {
          title: 'Products',
          subtitle: 'Manage your product inventory and listings',
        };
      case '/orders':
        return {
          title: 'Orders',
          subtitle: 'Track and manage customer orders',
        };
      case '/customers':
        return {
          title: 'Customers',
          subtitle: 'View and manage your customer database',
        };
      case '/analytics':
        return {
          title: 'Analytics',
          subtitle: 'In-depth business insights and reporting',
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Configure your store settings and preferences',
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your business metrics and performance',
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen bg-primary-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title={title} subtitle={subtitle} />
        
        <main className="flex-1 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        
        <footer className="py-4 px-6 border-t border-primary-100 bg-white">
          <div className="text-center text-sm text-primary-400">
            &copy; {new Date().getFullYear()} Cartly. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;