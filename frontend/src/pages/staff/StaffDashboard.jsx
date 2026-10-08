import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { SHIFT_CONFIG } from '../../utils/attendanceUtils.js';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, Clock, AlertTriangle, Briefcase, CheckCircle, Bell, Users, FileText, Calendar, ChevronRight } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

export default function StaffDashboard() {
  const { user } = useAuth();
  const todayAtt = DUMMY_ATTENDANCE.find(a => a.userId === user?.id && a.date === today);
  const myClients = DUMMY_USERS.filter(u => u.role === 'client' && u.assignedStaffId === user?.staffId);
  const myWorks = CLIENT_WORKS.filter(w => w.staffId === user?.staffId);
  const myLeave = DUMMY_LEAVES.filter(l => l.staffId === user?.id);
  const latestLeave = myLeave[0];

  const activeW    = myWorks.filter(w => w.status === 'in_progress').length;
  const pendingW   = myWorks.filter(w => w.status === 'pending').length;
  const completedW = myWorks.filter(w => w.status === 'completed').length;
  const overdueW   = myWorks.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')).length;

  const attStatus = todayAtt?.status;
  const attColor = attStatus === 'present' ? 'text-green-600' : attStatus === 'late' ? 'text-yellow-600' : 'text-slate-400';

  const lateGraceEnd = (() => {
    const [h, m] = SHIFT_CONFIG.shiftStart.split(':').map(Number);
    const t = h * 60 + m + SHIFT_CONFIG.graceMins;
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  })();

  const NOTIFS = [
    { id: 1, msg: 'New work assigned: Income Tax Filing', icon: '📌', unread: true },
    { id: 2, msg: 'Work due tomorrow: Export Documentation', icon: '📅', unread: true },
    { id: 3, msg: 'Leave approved for Oct 20-22', icon: '✅', unread: false },
    { id: 4, msg: 'Admin announcement: Holiday on Oct 25', icon: '📢', unread: false },
  ];

  return (
    <DashboardLayout title="My Dashboard">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-3xl p-5 text-white mb-5 flex items-center gap-4">
        <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=16a34a&color=fff&size=128`}
          alt="" className="w-14 h-14 rounded-2xl border-2 border-white/30 object-cover shrink-0"/>
        <div className="flex-1">
          <p className="text-green-200 text-sm">Good morning,</p>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-green-200 text-xs">{user?.staffId?.toUpperCase()} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link to="/staff/notifications" className="relative w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30">
          <Bell size={20}/>
          {NOTIFS.filter(n => n.unread).length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">{NOTIFS.filter(n => n.unread).length}</span>}
        </Link>
      </div>

      {/* ─ Overdue Alert ─ */}
      {overdueW > 0 && (
        <Link to="/staff/overdue" className="block mb-5">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center shrink-0"><AlertTriangle size={22} className="text-white"/></div>
            <div className="flex-1">
              <p className="font-bold text-red-700">⚠️ {overdueW} Overdue Work!</p>
              <p className="text-red-500 text-sm">Requires immediate attention</p>
            </div>
            <ChevronRight size={18} className="text-red-400"/>
          </div>
        </Link>
      )}

      {/* ─ TODAY'S ATTENDANCE ─ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={16} className="text-green-600"/> Today's Attendance</h3>

        {/* Shift info */}
        <div className="bg-green-50 rounded-xl px-4 py-2.5 flex gap-4 text-xs text-green-700 mb-4">
          <span>⏰ Shift: <strong>{SHIFT_CONFIG.shiftStart}</strong></span>
          <span>⚡ Grace: <strong>{SHIFT_CONFIG.graceMins} mins</strong></span>
          <span>🔴 Late after: <strong>{lateGraceEnd}</strong></span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-medium mb-1">Punch In</p>
            <p className={`text-2xl font-bold ${todayAtt?.punchIn ? 'text-slate-800' : 'text-slate-300'}`}>{todayAtt?.punchIn || '—'}</p>
            {todayAtt && <p className={`text-xs mt-1 font-semibold ${attColor}`}>{attStatus === 'late' ? '⚠️ Late' : '✓ On Time'}</p>}
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-medium mb-1">Punch Out</p>
            <p className={`text-2xl font-bold ${todayAtt?.punchOut ? 'text-slate-800' : 'text-slate-300'}`}>{todayAtt?.punchOut || '—'}</p>
            {todayAtt?.punchOut && <p className="text-green-600 text-xs mt-1 font-semibold">✓ Recorded</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/staff/attendance" className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition ${todayAtt?.punchIn ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-green-500 hover:bg-green-400 text-white'}`}>
            <LogIn size={17}/> {todayAtt?.punchIn ? 'Punched In ✓' : 'Punch In'}
          </Link>
          <Link to="/staff/attendance" className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition ${!todayAtt?.punchIn || todayAtt?.punchOut ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-red-500 hover:bg-red-400 text-white'}`}>
            <LogOut size={17}/> {todayAtt?.punchOut ? 'Punched Out ✓' : 'Punch Out'}
          </Link>
        </div>
      </div>

      {/* ─ Work Summary ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[['Active',activeW,'blue','/staff/work'],['Pending',pendingW,'yellow','/staff/work'],['Completed',completedW,'green','/staff/work'],['Overdue',overdueW,'red','/staff/overdue']].map(([l,v,c,to])=>(
          <Link key={l} to={to} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 hover:shadow-md transition`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l} Work</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Clients */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={15} className="text-green-600"/>My Clients</h3>
            <Link to="/staff/clients" className="text-xs text-green-600 font-semibold">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myClients.slice(0, 4).map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50">
                <img src={c.photo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                <div className="flex-1">
                  <p className="font-medium text-slate-700 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.service}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{c.status}</span>
              </div>
            ))}
            {myClients.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">No clients assigned</p>}
          </div>
        </div>

        {/* Leave Status + Notifications */}
        <div className="space-y-4">
          {latestLeave && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><FileText size={15} className="text-green-600"/>Leave Status</h3>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-700">{latestLeave.leaveType}</p>
                  <p className="text-xs text-slate-400">{latestLeave.fromDate} → {latestLeave.toDate}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${latestLeave.status==='approved'?'bg-green-100 text-green-700':latestLeave.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{latestLeave.status}</span>
              </div>
              <Link to="/staff/leave" className="text-xs text-green-600 font-semibold mt-2 block text-right">View All →</Link>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell size={15} className="text-green-600"/>Notifications</h3>
              <Link to="/staff/notifications" className="text-xs text-green-600 font-semibold">View All →</Link>
            </div>
            {NOTIFS.map(n => (
              <div key={n.id} className={`px-5 py-3 flex items-center gap-3 border-b border-slate-50 last:border-0 ${n.unread?'bg-green-50/30 border-l-4 border-l-green-400':''}`}>
                <span className="shrink-0">{n.icon}</span>
                <p className={`text-xs flex-1 ${n.unread?'font-semibold text-slate-800':'text-slate-600'}`}>{n.msg}</p>
                {n.unread && <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
