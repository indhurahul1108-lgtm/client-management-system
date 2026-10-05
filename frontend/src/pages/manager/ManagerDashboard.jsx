import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { Users, Building2, CalendarCheck, FileText, AlertTriangle } from 'lucide-react';

const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === 'm001');
const myClients = DUMMY_USERS.filter(u => u.role === 'client');
const pendingLeaves = DUMMY_LEAVES.filter(l => l.status === 'pending');
const overdues = DUMMY_OVERDUE.filter(o => o.status === 'overdue');
const today = new Date().toISOString().split('T')[0];

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  };
  const iconColors = {
    blue: 'bg-blue-600', purple: 'bg-purple-600', green: 'bg-green-600', red: 'bg-red-600', yellow: 'bg-yellow-500',
  };
  return (
    <div className={`${colors[color]} border rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-11 h-11 ${iconColors[color]} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', overdue: 'bg-red-100 text-red-700', present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700', active: 'bg-green-100 text-green-700', inactive: 'bg-slate-100 text-slate-600' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function ManagerDashboard() {
  const presentToday = DUMMY_ATTENDANCE.filter(a => a.status === 'present').length;
  const absentToday  = DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length;

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="My Staff"      value={myStaff.length}    icon={Users}        color="blue" />
        <StatCard label="My Clients"    value={myClients.length}  icon={Building2}    color="purple" />
        <StatCard label="Present Today" value={presentToday}      icon={CalendarCheck} color="green" />
        <StatCard label="Absent Today"  value={absentToday}       icon={Users}        color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Staff */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Staff</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {myStaff.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-700 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.mobile}</p>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Pending Leave Requests</h2>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingLeaves.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{l.staffName}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{l.leaveType}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-medium hover:bg-green-200 transition">Approve</button>
                      <button className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-medium hover:bg-red-200 transition">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Overdue Items</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{overdues.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {overdues.map(o => (
              <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{o.clientName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{o.task}</p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">+{o.overdueDays}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Attendance quick view */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Today's Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">In</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_ATTENDANCE.slice(0, 5).map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{a.staffName}</td>
                    <td className="px-4 py-3 text-slate-500">{a.punchIn || '—'}</td>
                    <td className="px-4 py-3"><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
