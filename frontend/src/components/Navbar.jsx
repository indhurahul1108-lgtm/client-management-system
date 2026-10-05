import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  admin: 'Administrator', manager: 'Manager', staff: 'Staff', client: 'Client',
};

const ROLE_BADGE = {
  admin:   'bg-blue-100 text-blue-700',
  manager: 'bg-purple-100 text-purple-700',
  staff:   'bg-green-100 text-green-700',
  client:  'bg-orange-100 text-orange-700',
};

export default function Navbar({ title }) {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="pl-10 lg:pl-0">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{dateStr}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
          <Bell size={16} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl px-3 py-2">
          <img src={user?.photo} alt={user?.name} className="w-7 h-7 rounded-lg object-cover" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-none">{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_BADGE[user?.role]}`}>
              {ROLE_LABELS[user?.role]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
