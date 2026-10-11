import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

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
  const { lang, toggleLanguage } = useLanguage();
  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="pl-10 lg:pl-0 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="ELAKIYAA"
          className="h-8 w-auto hidden sm:block object-contain"
        />
        <div className="border-l border-slate-200 pl-3 hidden sm:block">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">{title}</h1>
          <p className="text-[11px] text-slate-400">{dateStr}</p>
        </div>
        <div className="sm:hidden">
          <h1 className="text-sm font-bold text-slate-800">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Tamil / English One-Click Switcher */}
        <button
          onClick={toggleLanguage}
          title="Switch Language / மொழியை மாற்றுக"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs transition shadow-sm"
        >
          <Languages size={14} className="text-orange-600" />
          <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

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
