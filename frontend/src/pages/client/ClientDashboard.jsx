import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { getClientData, calcOverdueDays } from '../../data/clientData.js';
import { Bell, Briefcase, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLOR = {
  in_progress: 'bg-blue-100 text-blue-700',
  pending:     'bg-yellow-100 text-yellow-700',
  completed:   'bg-green-100 text-green-700',
  overdue:     'bg-red-100 text-red-700',
  on_hold:     'bg-slate-100 text-slate-600',
};
const STATUS_LABEL = {
  in_progress: 'In Progress',
  pending:     'Pending',
  completed:   'Completed',
  overdue:     'Overdue',
  on_hold:     'On Hold',
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const assignedStaff   = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);

  // Stats
  const total     = data.works.length;
  const inProg    = data.works.filter(w => w.status === 'in_progress').length;
  const completed = data.works.filter(w => w.status === 'completed').length;
  const pending   = data.works.filter(w => w.status === 'pending').length;
  const overdue   = data.works.filter(w => w.status === 'overdue' || calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed').length;
  const unread    = data.notifications.filter(n => !n.read).length;

  const recentWorks = [...data.works].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, 3);
  const overdueWorks = data.works.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed'));
  const recentNotifs = data.notifications.slice(0, 4);
  const pendingReqs  = data.requests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout title="My Dashboard">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=fff&color=f97316&size=128`}
            alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shrink-0" />
          <div className="flex-1">
            <p className="text-orange-100 text-sm font-medium">Welcome back!</p>
            <h1 className="text-xl font-bold">{user?.name || 'Client'}</h1>
            <p className="text-orange-100 text-xs mt-0.5">ID: {user?.clientId?.toUpperCase()} &nbsp;|&nbsp; {user?.service || 'Client Portal'}</p>
          </div>
          {unread > 0 && (
            <div className="shrink-0">
              <Link to="/client/notifications" className="relative flex items-center justify-center w-11 h-11 bg-white/20 rounded-xl">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">{unread}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Assigned staff info */}
        {assignedStaff && (
          <div className="mt-4 bg-white/15 rounded-2xl px-4 py-3 flex items-center gap-3">
            <img src={assignedStaff.photo} alt="" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="text-orange-100 text-xs">Your Assigned Staff</p>
              <p className="font-semibold text-sm">{assignedStaff.name} &nbsp;·&nbsp; 📞 {assignedStaff.mobile}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Overdue Alert ── */}
      {overdueWorks.length > 0 && (
        <Link to="/client/overdue" className="block mb-5">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-700">⚠️ Overdue Work Alert</p>
              <p className="text-red-600 text-sm">{overdueWorks.length} work item{overdueWorks.length > 1 ? 's' : ''} require immediate attention</p>
            </div>
            <ChevronRight size={18} className="text-red-400" />
          </div>
        </Link>
      )}

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Work',  value: total,     color: 'blue',   icon: <Briefcase size={18} className="text-white" />,    to: '/client/work' },
          { label: 'In Progress', value: inProg,    color: 'violet', icon: <TrendingUp size={18} className="text-white" />,   to: '/client/work' },
          { label: 'Completed',   value: completed, color: 'green',  icon: <CheckCircle size={18} className="text-white" />,  to: '/client/history' },
          { label: 'Overdue',     value: overdue,   color: 'red',    icon: <AlertTriangle size={18} className="text-white" />,to: '/client/overdue' },
        ].map(s => (
          <Link key={s.label} to={s.to}
            className={`bg-${s.color}-50 border border-${s.color}-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition`}>
            <div className={`w-10 h-10 bg-${s.color}-600 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold text-${s.color}-800`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Recent Work ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Briefcase size={16} className="text-orange-500" /> Recent Work</h3>
            <Link to="/client/work" className="text-xs text-orange-500 font-semibold hover:text-orange-700">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentWorks.length > 0 ? recentWorks.map(w => (
              <Link key={w.id} to={`/client/work`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition">
                <div className={`w-2 h-2 rounded-full shrink-0 ${w.status === 'completed' ? 'bg-green-500' : w.status === 'overdue' ? 'bg-red-500' : w.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700 text-sm truncate">{w.title}</p>
                  <p className="text-xs text-slate-400">Due: {w.dueDate} &nbsp;·&nbsp; {w.staffName}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[w.status]}`}>{STATUS_LABEL[w.status]}</span>
              </Link>
            )) : <p className="text-center py-8 text-slate-400 text-sm">No work assigned yet</p>}
          </div>
        </div>

        {/* ── Recent Notifications ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell size={16} className="text-orange-500" /> Notifications {unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}</h3>
            <Link to="/client/notifications" className="text-xs text-orange-500 font-semibold hover:text-orange-700">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentNotifs.length > 0 ? recentNotifs.map(n => (
              <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition ${!n.read ? 'bg-orange-50/40 border-l-3 border-orange-400' : ''}`}>
                <span className="text-lg shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 truncate">{n.message}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-2" />}
              </div>
            )) : <p className="text-center py-8 text-slate-400 text-sm">No notifications</p>}
          </div>
        </div>

        {/* ── Pending Requests ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-orange-500" /> My Requests</h3>
            <Link to="/client/requests" className="text-xs text-orange-500 font-semibold hover:text-orange-700">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {data.requests.slice(0, 3).map(r => (
              <div key={r.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{r.type}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{r.reason}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                  ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {r.status}
                </span>
              </div>
            ))}
            {data.requests.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No requests</p>}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <Link to="/client/requests" className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition">
              + New Request
            </Link>
          </div>
        </div>

        {/* ── Work Progress ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={16} className="text-orange-500" /> Work Progress</h3>
          </div>
          <div className="p-5 space-y-4">
            {data.works.filter(w => w.status !== 'completed').slice(0, 3).map(w => (
              <div key={w.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-700 truncate max-w-[70%]">{w.title}</p>
                  <span className="text-xs font-bold text-slate-500">{w.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${w.status === 'overdue' ? 'bg-red-500' : w.progress >= 80 ? 'bg-green-500' : 'bg-orange-400'}`}
                    style={{ width: `${w.progress}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">Due: {w.dueDate}</p>
              </div>
            ))}
            {data.works.filter(w => w.status !== 'completed').length === 0 && (
              <p className="text-center py-6 text-slate-400 text-sm">All work completed! 🎉</p>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
