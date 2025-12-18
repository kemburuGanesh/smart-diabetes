import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthData } from '@/contexts/HealthDataContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Brain,
  Activity,
  Bell,
  Settings,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, profile, logout } = useAuth();
  const { alerts } = useHealthData();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/dashboard/patients' },
    { icon: Brain, label: 'AI Diagnosis', path: '/dashboard/diagnosis' },
    { icon: Activity, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Bell, label: 'Alerts', path: '/dashboard/alerts', badge: unreadAlerts },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">HealthCloud</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto h-5 min-w-[20px] px-1.5 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
            {isCollapsed && item.badge && item.badge > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-destructive-foreground font-bold">
                {item.badge}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-sidebar-accent/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">
                {profile?.role || 'Doctor'}
              </p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
    </aside>
  );
};

export default Sidebar;
