import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart4,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Products',
    path: '/products',
    icon: <Package size={20} />,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: <ShoppingCart size={20} />,
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: <Users size={20} />,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <BarChart4 size={20} />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings size={20} />,
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-screen w-64 bg-sidebar border-r border-primary-100 transition-transform lg:translate-x-0 lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 p-1 text-white lg:hidden"
          onClick={onToggle}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-primary-100">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 rounded-md bg-primary-600 flex items-center justify-center text-white">
              <Package size={20} />
            </div>
            <span className="text-xl font-semibold text-white">Cartly</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-white hover:bg-primary-100/10'
                )
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-100">
          <button className="flex items-center px-4 py-3 text-sm font-medium text-white rounded-md hover:bg-primary-100/10 w-full">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        className="fixed bottom-4 right-4 z-10 p-3 rounded-full bg-primary-600 text-white shadow-lg lg:hidden"
        onClick={onToggle}
      >
        <Menu size={24} />
      </button>
    </>
  );
}

export default Sidebar;