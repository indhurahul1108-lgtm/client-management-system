import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Users, Building2, CalendarCheck, AlertTriangle, Clock, FileText, CheckCircle, TrendingUp, Bell, ChevronRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const today = new Date().toISOString().split('T')[0];

export default function ManagerDashboard() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';

  // My staff
  const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === mId);
  const myStaffIds = myStaff.map(s => s.staffId);

  // My clients (via assigned staff)
  const myClients = DUMMY_USERS.filter(u => u.role === 'client' && myStaffIds.includes(u.assignedStaffId));

  // Attendance today
  const todayAtt  = DUMMY_ATTENDANCE.filter(a => a.date === today && myStaff.find(s => s.id === a.userId));
  const presentT  = todayAtt.filter(a => a.status === 'present').length;
  const absentT   = todayAtt.filter(a => a.status === 'absent').length;
  const lateT     = todayAtt.filter(a => a.status === 'late').length;

  // Leave
  const [leaves, setLeaves] = useState(DUMMY_LEAVES.filter(l => myStaff.find(s => s.id === l.staffId)));
  const pendingLeave = leaves.filter(l => l.status === 'pending');

  // Work
  const myWorks    = CLIENT_WORKS.filter(w => myStaffIds.includes(w.staffId));
  const activeWork = myWorks.filter(w => w.status === 'in_progress').length;
  const overdueW   = myWorks.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')).length;
  const completedW = myWorks.filter(w => w.status === 'completed').length;

  const handleLeave = (id, action) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l));
  };

  const NOTIFS = [
    { id:1, msg:`${myStaff[0]?.name || 'Staff'} applied for leave`, icon:'📋', unread:true },
    { id:2, msg:'Work overdue: GST Filing — 3 days', icon:'⚠️', unread:true },
    { id:3, msg:'New work assigned to your team', icon:'📌', unread:false },
    { id:4, msg:'Client sent a request', icon:'🏢', unread:false },
  ];

  const StatCard = ({ label, value, color, icon, to }) => {
    const content = (
      <div className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition`}>
        <div className={`w-10 h-10 bg-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
        <div><p className={`text-xl font-bold text-${color}-800`}>{value}</p><p className="text-xs text-slate-500">{label}</p></div>
      </div>
    );
    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <DashboardLayout title="Manager Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-5 text-white mb-6 flex items-center gap-4">
        <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=7c3aed&color=fff&size=128`}
          alt="" className="w-14 h-14 rounded-2xl border-2 border-white/30 object-cover shrink-0" />
        <div className="flex-1">
          <p className="text-purple-200 text-sm">Welcome back,</p>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-purple-200 text-xs">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">{myStaff.length} Staff</p>
          <p className="text-purple-200 text-xs">{myClients.length} Clients</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="My Staff"   value={myStaff.length}   color="purple" icon={<Users size={18} className="text-white"/>}        to="/manager/staff" />
        <StatCard label="My Clients" value={myClients.length} color="blue"   icon={<Building2 size={18} className="text-white"/>}    to="/manager/clients" />
        <StatCard label="Active Work" value={activeWork}      color="green"  icon={<TrendingUp size={18} className="text-white"/>}   to="/manager/work" />
        <StatCard label="Overdue"    value={overdueW}         color="red"    icon={<AlertTriangle size={18} className="text-white"/>} to="/manager/overdue" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Present Today"   value={presentT}           color="green"  icon={<CalendarCheck size={18} className="text-white"/>} to="/manager/attendance" />
        <StatCard label="Absent Today"    value={absentT}            color="red"    icon={<Users size={18} className="text-white"/>}         to="/manager/attendance" />
        <StatCard label="Late Today"      value={lateT}              color="yellow" icon={<Clock size={18} className="text-white"/>}         to="/manager/attendance" />
        <StatCard label="Pending Leave"   value={pendingLeave.length} color="orange" icon={<FileText size={18} className="text-white"/>}    to="/manager/leave" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><CalendarCheck size={16} className="text-purple-600"/>Today's Attendance</h3>
            <Link to="/manager/attendance" className="text-xs text-purple-600 font-semibold">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myStaff.slice(0,5).map(s => {
              const att = DUMMY_ATTENDANCE.find(a => a.userId === s.id && a.date === today);
              return (
                <div key={s.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50">
                  <img src={s.photo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 text-sm">{s.name}</p>
                    <p className="text-xs text-slate-400">{att?.punchIn ? `In: ${att.punchIn}` : 'Not yet'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                    ${!att ? 'bg-slate-100 text-slate-500' : att.status==='present'?'bg-green-100 text-green-700':att.status==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>
                    {att?.status || 'pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={16} className="text-purple-600"/>Leave Requests
              {pendingLeave.length > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{pendingLeave.length}</span>}
            </h3>
            <Link to="/manager/leave" className="text-xs text-purple-600 font-semibold">Manage →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingLeave.slice(0,4).map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-2 hover:bg-slate-50">
                <div className="flex-1">
                  <p className="font-medium text-slate-700 text-sm">{l.staffName} — {l.leaveType}</p>
                  <p className="text-xs text-slate-400">{l.fromDate} → {l.toDate}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleLeave(l.id,'approve')} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-green-200">✓</button>
                  <button onClick={() => handleLeave(l.id,'reject')}  className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-red-200">✗</button>
                </div>
              </div>
            ))}
            {pendingLeave.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">No pending requests</p>}
          </div>
        </div>

        {/* Overdue Work */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/>Overdue Work</h3>
            <Link to="/manager/overdue" className="text-xs text-red-500 font-semibold">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myWorks.filter(w => w.status==='overdue' || (calcOverdueDays(w.dueDate)>0 && w.status!=='completed')).slice(0,4).map(w => (
              <div key={w.id} className="px-5 py-3 flex items-start justify-between hover:bg-red-50/30">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{w.title}</p>
                  <p className="text-xs text-slate-400">{w.staffName} · Due: {w.dueDate}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">+{calcOverdueDays(w.dueDate)}d</span>
              </div>
            ))}
            {overdueW === 0 && <p className="text-center py-6 text-green-600 text-sm font-medium">✅ No overdue!</p>}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell size={16} className="text-purple-600"/>Notifications</h3>
            <Link to="/manager/notifications" className="text-xs text-purple-600 font-semibold">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {NOTIFS.map(n => (
              <div key={n.id} className={`px-5 py-3 flex items-center gap-3 hover:bg-slate-50 ${n.unread?'bg-purple-50/30 border-l-4 border-purple-400':''}`}>
                <span className="text-lg shrink-0">{n.icon}</span>
                <p className={`text-sm flex-1 ${n.unread?'font-semibold text-slate-800':'text-slate-600'}`}>{n.msg}</p>
                {n.unread && <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0"/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
