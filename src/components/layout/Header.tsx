
import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { stats } = useDashboard();
  const navigate = useNavigate();
  
  const handleNotificationClick = () => {
    navigate('/support');
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 fixed top-0 right-0 left-0 z-40 md:left-64">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-full text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none relative"
            >
              <Bell className="h-5 w-5" />
              {stats?.reports && stats.reports.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.reports.length}
                </span>
              )}
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 gap-2">
                <span className="hidden md:block text-gray-700">{stats?.account?.name || 'Admin'}</span>
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
