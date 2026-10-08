import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import {
  Users, UserCheck, Building2, CalendarCheck, Clock, AlertTriangle,
  Briefcase, CheckCircle, TrendingUp, Bell, Activity, LogOut, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const today = new Date().toISOString().split('T')[0];

const staff    = DUMMY_USERS.filter(u => u.role === 'staff');
const managers = DUMMY_USERS.filter(u => u.role === 'manager');
const clients  = DUMMY_USERS.filter(u => u.role === 'client');

const presentToday = DUMMY_ATTENDANCE.filter(a => a.date === today && a.status === 'present').length;
const absentToday  = DUMMY_ATTENDANCE.filter(a => a.date === today && a.status === 'absent').length;
const lateToday    = DUMMY_ATTENDANCE.filter(a => a.date === today && a.status === 'late').length;
const onLeave      = DUMMY_LEAVES.filter(l => l.status === 'approved' && l.fromDate <= today && l.toDate >= today).length;
const pendingLeave = DUMMY_LEAVES.filter(l => l.status === 'pending').length;

const allWorks    = CLIENT_WORKS;
const activeWork  = allWorks.filter(w => w.status === 'in_progress').length;
const completedW  = allWorks.filter(w => w.status === 'completed').length;
const pendingW    = allWorks.filter(w => w.status === 'pending').length;
const overdueW    = allWorks.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')).length;

const RECENT_ACTIVITY = [
  { id:1, user:'Anitha Devi',  action:'Punched In',             time:'10:05 AM', icon:'🟢', module:'Attendance' },
  { id:2, user:'Murugan P',    action:'Applied for Sick Leave',  time:'09:30 AM', icon:'📋', module:'Leave' },
  { id:3, user:'Admin',        action:'Added New Client: XYZ Co',time:'09:00 AM', icon:'🏢', module:'Clients' },
  { id:4, user:'Deepa S',      action:'Completed Work WRK-003',  time:'Yesterday', icon:'✅', module:'Work' },
  { id:5, user:'Vijay S',      action:'Marked Late',             time:'10:35 AM', icon:'🔴', module:'Attendance' },
];

const NOTIFICATIONS = [
  { id:1, msg:'Murugan P applied for Sick Leave — pending approval', type:'leave',   icon:'📋', unread:true },
  { id:2, msg:'GST Filing for Sri Tech is 3 days overdue',          type:'overdue',  icon:'⚠️', unread:true },
  { id:3, msg:'New client Delta Logistics registered',              type:'client',   icon:'🏢', unread:false },
  { id:4, msg:'Vijay S was marked late today (10:35 AM)',           type:'attend',   icon:'🕐', unread:true },
];

function StatCard({ label, value, color, icon, to }) {
  const card = (
    <div className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-5 flex items-center gap-3 hover:shadow-md transition`}>
      <div className={`w-11 h-11 bg-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Admin Dashboard">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-6 text-white mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div className="flex-1">
          <p className="text-blue-200 text-sm">Welcome back,</p>
          <h1 className="text-xl font-bold">{user?.name || 'Admin'}</h1>
          <p className="text-blue-300 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <div className="text-right text-sm text-blue-200">
          <p className="font-bold text-white text-lg">{new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</p>
          <p>System Active</p>
        </div>
      </div>

      {/* ── Section 1: People ── */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">👥 Organization</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Managers" value={managers.length}  color="purple" icon={<UserCheck  size={20} className="text-white"/>} to="/admin/managers" />
        <StatCard label="Total Staff"    value={staff.length}     color="blue"   icon={<Users      size={20} className="text-white"/>} to="/admin/staff" />
        <StatCard label="Total Clients"  value={clients.length}   color="orange" icon={<Building2  size={20} className="text-white"/>} to="/admin/clients" />
        <StatCard label="Total Users"    value={DUMMY_USERS.length} color="slate" icon={<Users     size={20} className="text-white"/>} to="/admin/users" />
      </div>

      {/* ── Section 2: Attendance ── */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">📅 Today's Attendance</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Present Today"  value={presentToday}   color="green"  icon={<CalendarCheck size={20} className="text-white"/>} to="/admin/attendance" />
        <StatCard label="Absent Today"   value={absentToday}    color="red"    icon={<Users         size={20} className="text-white"/>} to="/admin/attendance" />
        <StatCard label="Late Today"     value={lateToday}      color="yellow" icon={<Clock         size={20} className="text-white"/>} to="/admin/attendance" />
        <StatCard label="On Leave"       value={onLeave}        color="slate"  icon={<LogOut        size={20} className="text-white"/>} to="/admin/leave" />
      </div>

      {/* ── Section 3: Work ── */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">📋 Work Status</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Work"    value={activeWork}   color="blue"   icon={<TrendingUp  size={20} className="text-white"/>} to="/admin/assign-tasks" />
        <StatCard label="Completed"      value={completedW}   color="green"  icon={<CheckCircle size={20} className="text-white"/>} to="/admin/assign-tasks" />
        <StatCard label="Pending Work"   value={pendingW}     color="yellow" icon={<Clock       size={20} className="text-white"/>} to="/admin/assign-tasks" />
        <StatCard label="Overdue"        value={overdueW}     color="red"    icon={<AlertTriangle size={20} className="text-white"/>} to="/admin/overdue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Today's Attendance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><CalendarCheck size={16} className="text-blue-600"/>Today's Attendance</h3>
            <Link to="/admin/attendance" className="text-xs text-blue-600 font-semibold">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs text-slate-400 font-semibold">Name</th>
                  <th className="text-left px-4 py-2 text-xs text-slate-400 font-semibold">Punch In</th>
                  <th className="text-left px-4 py-2 text-xs text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_ATTENDANCE.slice(0,6).map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-700 text-xs">{a.staffName}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{a.punchIn || '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                        ${a.status==='present'?'bg-green-100 text-green-700':a.status==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={16} className="text-purple-600"/>Pending Leave
              {pendingLeave > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingLeave}</span>}
            </h3>
            <Link to="/admin/leave" className="text-xs text-purple-600 font-semibold">Manage →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {DUMMY_LEAVES.filter(l=>l.status==='pending').map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{l.staffName}</p>
                  <p className="text-xs text-slate-400">{l.leaveType} · {l.fromDate} → {l.toDate}</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
              </div>
            ))}
            {pendingLeave === 0 && <p className="text-center py-6 text-slate-400 text-sm">No pending requests</p>}
          </div>
        </div>

        {/* Overdue Work */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/>Overdue Work</h3>
            <Link to="/admin/overdue" className="text-xs text-red-500 font-semibold">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {CLIENT_WORKS.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')).slice(0,4).map(w => (
              <div key={w.id} className="px-5 py-3 flex items-start justify-between hover:bg-red-50/30">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{w.title}</p>
                  <p className="text-xs text-slate-400">{w.staffName} · Due: {w.dueDate}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">+{calcOverdueDays(w.dueDate)}d</span>
              </div>
            ))}
            {overdueW === 0 && <p className="text-center py-6 text-green-600 text-sm font-medium">✅ No overdue work!</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-blue-600"/>Recent Activity</h3>
            <Link to="/admin/audit-log" className="text-xs text-blue-600 font-semibold">Audit Log →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50">
                <span className="text-lg shrink-0">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700"><span className="text-slate-500">{a.user}</span> · {a.action}</p>
                  <p className="text-xs text-slate-400">{a.module} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Bell size={16} className="text-blue-600"/>Notifications
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{NOTIFICATIONS.filter(n=>n.unread).length}</span>
          </h3>
          <Link to="/admin/notifications" className="text-xs text-blue-600 font-semibold">View All →</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`px-5 py-3 flex items-center gap-3 hover:bg-slate-50 ${n.unread ? 'bg-blue-50/30 border-l-4 border-blue-400' : ''}`}>
              <span className="text-lg shrink-0">{n.icon}</span>
              <p className={`text-sm flex-1 ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.msg}</p>
              {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
