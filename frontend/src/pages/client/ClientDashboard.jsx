import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { getClientData } from '../../data/clientData.js';
import { Bell, Briefcase, CheckCircle, Clock, FileText, ChevronRight, TrendingUp, Calendar, ShieldCheck, MapPin, Phone, Building2, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLOR = {
  in_progress: 'bg-blue-100 text-blue-700',
  pending:     'bg-yellow-100 text-yellow-700',
  completed:   'bg-green-100 text-green-700',
  overdue:     'bg-orange-100 text-orange-700',
  on_hold:     'bg-slate-100 text-slate-600',
};
const STATUS_LABEL = {
  in_progress: 'In Progress',
  pending:     'Pending Review',
  completed:   'Completed',
  overdue:     'In Review',
  on_hold:     'On Hold',
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);
  const assignedManager = DUMMY_USERS.find(u => u.role === 'manager' && (u.managerId === user?.assignedManagerId || u.managerId === 'm001'));

  // Stats
  const total     = data.works.length;
  const inProg    = data.works.filter(w => w.status === 'in_progress').length;
  const completed = data.works.filter(w => w.status === 'completed').length;
  const pending   = data.works.filter(w => w.status === 'pending').length;
  const unread    = data.notifications.filter(n => !n.read).length;

  const recentWorks = [...data.works].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, 3);
  const recentNotifs = data.notifications.slice(0, 4);
  const pendingReqs  = data.requests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout title="Client Enterprise Portal">

      {/* Enterprise Corporate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-orange-900 rounded-3xl p-6 text-white mb-6 shadow-xl border border-orange-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff&size=128`}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400/40 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">{user?.name || 'Enterprise Client'}</h1>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> Verified Account
                </span>
              </div>
              <p className="text-orange-200 text-xs mt-0.5">
                Client ID: <span className="font-mono font-bold text-white">{user?.clientId?.toUpperCase() || 'C001'}</span> &nbsp;|&nbsp; {user?.service || 'Corporate Compliance & Audit'}
              </p>
              <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                <MapPin size={11} /> {user?.address || 'Chennai, Tamil Nadu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/client/checkin"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
            >
              <CalendarCheck size={14} /> Office Check-In
            </Link>
            {unread > 0 && (
              <Link to="/client/notifications" className="relative flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl hover:bg-white/20 transition">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Dedicated Account Management Team Card */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {assignedStaff && (
            <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
              <img src={assignedStaff.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div>
                <p className="text-orange-200 text-[10px] font-semibold uppercase">Assigned Service Staff</p>
                <p className="font-bold text-white text-xs">{assignedStaff.name}</p>
                <p className="text-slate-300 text-[11px] font-mono">📞 {assignedStaff.mobile}</p>
              </div>
            </div>
          )}
          {assignedManager && (
            <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
              <img src={assignedManager.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div>
                <p className="text-purple-200 text-[10px] font-semibold uppercase">Relationship Manager</p>
                <p className="font-bold text-white text-xs">{assignedManager.name}</p>
                <p className="text-slate-300 text-[11px] font-mono">📞 {assignedManager.mobile}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corporate Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Deliverables', value: inProg, color: 'blue', icon: <Briefcase size={18} className="text-white" />, to: '/client/work' },
          { label: 'Completed Services', value: completed, color: 'green', icon: <CheckCircle size={18} className="text-white" />, to: '/client/history' },
          { label: 'Under Review', value: pending, color: 'yellow', icon: <Clock size={18} className="text-white" />, to: '/client/work' },
          { label: 'Total Services', value: total, color: 'purple', icon: <TrendingUp size={18} className="text-white" />, to: '/client/work' },
        ].map(s => (
          <Link
            key={s.label}
            to={s.to}
            className={`bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition`}
          >
            <div className={`w-10 h-10 bg-${s.color}-600 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-800 font-mono">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Active Corporate Services / Work ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={16} className="text-orange-500" /> Current Work & Deliverables
            </h3>
            <Link to="/client/work" className="text-xs text-orange-600 font-bold hover:text-orange-700">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentWorks.length > 0 ? recentWorks.map(w => (
              <Link key={w.id} to={`/client/work`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition">
                <div className={`w-2 h-2 rounded-full shrink-0 ${w.status === 'completed' ? 'bg-green-500' : w.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-xs truncate">{w.title}</p>
                  <p className="text-[11px] text-slate-400">Target Date: {w.dueDate} &nbsp;·&nbsp; Staff: {w.staffName}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${STATUS_COLOR[w.status]}`}>
                    {STATUS_LABEL[w.status]}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{w.progress}% completed</p>
                </div>
              </Link>
            )) : <p className="text-center py-8 text-slate-400 text-xs">No active assignments</p>}
          </div>
        </div>

        {/* ── Official Notifications ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Bell size={16} className="text-orange-500" /> Notifications & Updates
              {unread > 0 && <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
            </h3>
            <Link to="/client/notifications" className="text-xs text-orange-600 font-bold hover:text-orange-700">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentNotifs.length > 0 ? recentNotifs.map(n => (
              <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition ${!n.read ? 'bg-orange-50/30' : ''}`}>
                <span className="text-lg shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{n.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{n.message}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-2" />}
              </div>
            )) : <p className="text-center py-8 text-slate-400 text-xs">No notifications</p>}
          </div>
        </div>

        {/* ── Client Formal Requests & Leave ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={16} className="text-orange-500" /> Service & Leave Requests
            </h3>
            <Link to="/client/requests" className="text-xs text-orange-600 font-bold hover:text-orange-700">Submit New →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {data.requests.slice(0, 3).map(r => (
              <div key={r.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-800 text-xs">{r.type}</p>
                  <p className="text-[11px] text-slate-400">{r.fromDate} → {r.toDate}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {r.status}
                </span>
              </div>
            ))}
            {data.requests.length === 0 && <p className="text-center py-6 text-slate-400 text-xs">No requests filed</p>}
          </div>
        </div>

        {/* ── Quick Links for Enterprise Client ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-3">Enterprise Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/client/checkin" className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition text-center">
                <CalendarCheck size={20} className="mx-auto text-orange-600 mb-1" />
                <p className="text-xs font-bold text-orange-800">Office Check In</p>
                <p className="text-[10px] text-orange-600">Log visit to HQ</p>
              </Link>
              <Link to="/client/documents" className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-center">
                <FileText size={20} className="mx-auto text-blue-600 mb-1" />
                <p className="text-xs font-bold text-blue-800">Documents</p>
                <p className="text-[10px] text-blue-600">Invoices & Agreements</p>
              </Link>
              <Link to="/client/messages" className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition text-center">
                <Briefcase size={20} className="mx-auto text-purple-600 mb-1" />
                <p className="text-xs font-bold text-purple-800">Direct Message</p>
                <p className="text-[10px] text-purple-600">Chat with Staff</p>
              </Link>
              <Link to="/client/history" className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition text-center">
                <CheckCircle size={20} className="mx-auto text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-emerald-800">Work History</p>
                <p className="text-[10px] text-emerald-600">Completed Audits</p>
              </Link>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-center">
            <p className="text-[11px] text-slate-500">Need corporate assistance? Call support: <span className="font-bold text-slate-700">1800-425-9000</span></p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
