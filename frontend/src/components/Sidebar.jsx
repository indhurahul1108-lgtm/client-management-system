import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, Building2, CalendarCheck,
  FileText, DollarSign, AlertTriangle, BarChart2, LogOut,
  ChevronLeft, ChevronRight, ClipboardList, User, Clock, Menu, X, Settings
} from 'lucide-react';

const MENUS = {
  admin: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/admin' },
    { label: 'Managers',     icon: UserCheck,       path: '/admin/managers' },
    { label: 'Staff',        icon: Users,           path: '/admin/staff' },
    { label: 'Clients',      icon: Building2,       path: '/admin/clients' },
    { label: 'Attendance',   icon: CalendarCheck,   path: '/admin/attendance' },
    { label: 'Leave',        icon: FileText,        path: '/admin/leave' },
    { label: 'Salary',       icon: DollarSign,      path: '/admin/salary' },
    { label: 'Assign Tasks', icon: ClipboardList,   path: '/admin/assign-tasks' },
    { label: 'Overdue',      icon: AlertTriangle,   path: '/admin/overdue' },
    { label: 'Reports',      icon: BarChart2,       path: '/admin/reports' },
    { label: 'Settings',     icon: Settings,        path: '/admin/settings' },
  ],
  manager: [
    { label: 'Dashboard',  icon: LayoutDashboard, path: '/manager' },
    { label: 'My Staff',   icon: Users,           path: '/manager/staff' },
    { label: 'Clients',    icon: Building2,       path: '/manager/clients' },
    { label: 'Attendance', icon: CalendarCheck,   path: '/manager/attendance' },
    { label: 'Leave',      icon: FileText,        path: '/manager/leave' },
    { label: 'Overdue',    icon: AlertTriangle,   path: '/manager/overdue' },
    { label: 'Reports',    icon: BarChart2,       path: '/manager/reports' },
  ],
  staff: [
    { label: 'Dashboard',  icon: LayoutDashboard, path: '/staff' },
    { label: 'Attendance', icon: Clock,           path: '/staff/attendance' },
    { label: 'Leave',      icon: FileText,        path: '/staff/leave' },
    { label: 'Salary',     icon: DollarSign,      path: '/staff/salary' },
    { label: 'My Clients', icon: Building2,       path: '/staff/clients' },
    { label: 'Overdue',    icon: AlertTriangle,   path: '/staff/overdue' },
    { label: 'Profile',    icon: User,            path: '/staff/profile' },
  ],
  client: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/client' },
    { label: 'My Work',   icon: ClipboardList,   path: '/client/work' },
    { label: 'Overdue',   icon: AlertTriangle,   path: '/client/overdue' },
    { label: 'Profile',   icon: User,            path: '/client/profile' },
  ],
};

const ROLE_COLORS = {
  admin:   'from-blue-700 to-blue-900',
  manager: 'from-purple-700 to-purple-900',
  staff:   'from-green-700 to-green-900',
  client:  'from-orange-600 to-orange-800',
};

const ROLE_LABELS = {
  admin: 'Administrator', manager: 'Manager', staff: 'Staff', client: 'Client',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const menus = MENUS[user.role] || [];
  const gradient = ROLE_COLORS[user.role];

  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-gradient-to-b ${gradient} text-white`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">CMS</div>
            <span className="font-bold text-sm">Client Manager</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white/40 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-white/60 text-xs">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menus.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-all text-sm font-medium
                ${active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition text-sm font-medium"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent />
      </div>
    </>
  );
}
