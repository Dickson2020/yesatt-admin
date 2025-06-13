
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Map, 
  MessageSquare, 
  CreditCard, 
  Settings,
  LogOut,
  Megaphone,
  ScanText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { stats } = useDashboard();
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Riders',
      path: '/riders',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Vehicles',
      path: '/vehicles',
      icon: <Car className="h-5 w-5" />
    },
    {
      name: 'Bookings',
      path: '/bookings',
      icon: <Map className="h-5 w-5" />
    },
    {
      name: 'Support',
      path: '/support',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: stats?.reports?.length > 0? stats?.reports?.length : ''
    },
    {
      name: 'KYC Verification',
      path: '/kyc',
      icon: <ScanText className="h-5 w-5" />,
      badge: stats?.kyc?.length > 0 ? stats?.kyc?.length : ''
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      name: 'Broadcast',
      path: '/broadcast',
      icon: <Megaphone className="h-5 w-5" />
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white shadow-lg hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-primary-300/30">
          <h1 className="text-xl font-bold">RideAdmin</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
            isActive 
              ? "bg-white text-primary font-medium" 
              : "text-white hover:bg-primary-dark hover:bg-opacity-20"
          )}
              >
          <span className="mr-3">{item.icon}</span>
          <span>{item.name}</span>
          {item.badge && item.badge > 0 && (
            <span className="ml-auto bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-primary-300/30">
          <button className="flex w-full items-center px-4 py-2 text-sm text-white rounded-lg hover:bg-primary-dark hover:bg-opacity-20 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
