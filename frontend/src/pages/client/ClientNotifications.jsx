import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getClientData } from '../../data/clientData.js';

const FILTERS = ['All', 'Unread'];

function groupByDate(notifications) {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const groups = { Today: [], Yesterday: [], Earlier: [] };
  notifications.forEach((n) => {
    const dateStr = n.createdAt.split('T')[0];
    if (dateStr === todayStr) groups.Today.push(n);
    else if (dateStr === yesterdayStr) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
}

export default function ClientNotifications() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const [notifications, setNotifications] = useState(data.notifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    return true;
  });

  const grouped = groupByDate(filtered);

  const formatTime = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout title="Notifications">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  activeFilter === f
                    ? 'bg-orange-500 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-semibold text-orange-500 hover:text-orange-700 min-h-[44px] px-3 transition-colors"
          >
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* Grouped Notifications */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-slate-700 mb-1">All caught up!</h2>
          <p className="text-slate-400">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([label, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={label}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</h3>
                <div className="space-y-2">
                  {items.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                        !n.read
                          ? 'border-l-4 border-l-orange-400 border-orange-100 bg-orange-50/60 shadow-sm'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0 mt-0.5">{n.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          <div className="flex-shrink-0 flex items-center gap-1.5">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                            )}
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {formatTime(n.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-300 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
