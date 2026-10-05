import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { Users, UserCheck, Building2, CalendarCheck, FileText, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const staff = DUMMY_USERS.filter(u => u.role === 'staff');
const managers = DUMMY_USERS.filter(u => u.role === 'manager');
const clients = DUMMY_USERS.filter(u => u.role === 'client');
const today = new Date().toISOString().split('T')[0];

const presentToday  = DUMMY_ATTENDANCE.filter(a => a.status === 'present').length;
const absentToday   = DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length;
const lateToday     = DUMMY_ATTENDANCE.filter(a => a.status === 'late').length;
const pendingLeaves = DUMMY_LEAVES.filter(l => l.status === 'pending').length;
const pendingSal    = DUMMY_SALARIES.filter(s => s.status === 'pending').length;
const overdueItems  = DUMMY_OVERDUE.filter(o => o.status === 'overdue').length;

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-white`}>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    present:  'bg-green-100 text-green-700',
    absent:   'bg-red-100 text-red-700',
    late:     'bg-yellow-100 text-yellow-700',
    pending:  'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    paid:     'bg-green-100 text-green-700',
    overdue:  'bg-red-100 text-red-700',
    completed:'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Managers" value={managers.length} icon={UserCheck}   color="bg-purple-600" bg="bg-purple-50" />
        <StatCard label="Total Staff"    value={staff.length}    icon={Users}        color="bg-blue-600"   bg="bg-blue-50" />
        <StatCard label="Total Clients"  value={clients.length}  icon={Building2}    color="bg-orange-500" bg="bg-orange-50" />
        <StatCard label="Present Today"  value={presentToday}    icon={CalendarCheck} color="bg-green-600"  bg="bg-green-50" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Absent Today"   value={absentToday}    icon={Users}        color="bg-red-500"    bg="bg-red-50" />
        <StatCard label="Late Today"     value={lateToday}      icon={CalendarCheck} color="bg-yellow-500" bg="bg-yellow-50" />
        <StatCard label="Leave Requests" value={pendingLeaves}  icon={FileText}     color="bg-indigo-500" bg="bg-indigo-50" />
        <StatCard label="Overdue Items"  value={overdueItems}   icon={AlertTriangle} color="bg-red-600"    bg="bg-red-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Today's Attendance</h2>
            <span className="text-xs text-slate-400">{today}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">In</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Out</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_ATTENDANCE.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{a.staffName}</td>
                    <td className="px-4 py-3 text-slate-500">{a.punchIn || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{a.punchOut || '—'}</td>
                    <td className="px-4 py-3"><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Leave Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_LEAVES.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{l.staffName}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{l.leaveType}</td>
                    <td className="px-4 py-3"><Badge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-800 mb-4">Salary Summary — October 2024</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{DUMMY_SALARIES.filter(s => s.status === 'paid').length}</p>
              <p className="text-sm text-green-600 font-medium mt-1">Paid</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{DUMMY_SALARIES.filter(s => s.status === 'pending').length}</p>
              <p className="text-sm text-yellow-600 font-medium mt-1">Pending</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Payable (October)</span>
              <span className="font-bold text-slate-800">
                ₹{DUMMY_SALARIES.filter(s => s.month === 'October 2024').reduce((s, a) => s + a.net, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Overdue Items</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {DUMMY_OVERDUE.filter(o => o.status === 'overdue').map(o => (
              <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{o.clientName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{o.task}</p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  +{o.overdueDays}d
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
