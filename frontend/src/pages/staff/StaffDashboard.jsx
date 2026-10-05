import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES, DUMMY_USERS, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { Clock, FileText, DollarSign, AlertTriangle, CalendarCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700', pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const myAttendance = DUMMY_ATTENDANCE.filter(a => a.userId === user?.id);
  const todayAttendance = myAttendance.find(a => a.date === today);
  const myLeaves = DUMMY_LEAVES.filter(l => l.staffId === user?.id);
  const myLatestSalary = DUMMY_SALARIES.filter(s => s.staffId === user?.id).slice(-1)[0];
  const myClient = DUMMY_USERS.find(u => u.role === 'client' && u.assignedStaffId === user?.staffId);
  const myOverdue = DUMMY_OVERDUE.filter(o => o.staffId === user?.staffId);

  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-3xl p-6 text-white mb-8 flex items-center justify-between">
        <div>
          <p className="text-green-200 text-sm font-medium">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-1">{user?.name}</h2>
          <p className="text-green-200 text-sm mt-1">Staff Member</p>
        </div>
        <img src={user?.photo} alt={user?.name} className="w-16 h-16 rounded-2xl border-2 border-white/30 object-cover" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Clock size={20} className="text-blue-600" />
            <Badge status={todayAttendance?.status || 'absent'} />
          </div>
          <p className="text-xl font-bold text-slate-800">{todayAttendance?.punchIn || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">Today's Punch In</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Clock size={20} className="text-orange-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">{todayAttendance?.punchOut || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">Today's Punch Out</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <FileText size={20} className="text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-800">{myLeaves.length}</p>
          <p className="text-xs text-slate-500 mt-1">Leave Applications</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={20} className="text-green-600" />
            {myLatestSalary && <Badge status={myLatestSalary.status} />}
          </div>
          <p className="text-xl font-bold text-slate-800">
            {myLatestSalary ? `₹${myLatestSalary.net.toLocaleString('en-IN')}` : '—'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Latest Salary</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Punch In/Out', icon: Clock, path: '/staff/attendance', color: 'from-blue-500 to-blue-700' },
          { label: 'Apply Leave',  icon: FileText, path: '/staff/leave', color: 'from-purple-500 to-purple-700' },
          { label: 'View Salary',  icon: DollarSign, path: '/staff/salary', color: 'from-green-500 to-green-700' },
          { label: 'My Profile',   icon: User, path: '/staff/profile', color: 'from-orange-500 to-orange-700' },
        ].map(({ label, icon: Icon, path, color }) => (
          <Link key={path} to={path} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white flex flex-col items-center gap-3 hover:scale-105 transition`}>
            <Icon size={24} />
            <span className="text-sm font-semibold text-center">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Leaves */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">My Leaves</h2>
            <Link to="/staff/leave" className="text-xs text-blue-600 hover:underline">View All</Link>
          </div>
          {myLeaves.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {myLeaves.slice(0, 3).map(l => (
                <div key={l.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{l.leaveType}</p>
                    <p className="text-xs text-slate-400">{l.fromDate} → {l.toDate}</p>
                  </div>
                  <Badge status={l.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">No leave applications</div>
          )}
        </div>

        {/* My Overdue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Tasks & Overdue</h2>
          </div>
          {myOverdue.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {myOverdue.map(o => (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{o.task}</p>
                    <p className="text-xs text-slate-400">{o.clientName} · Due: {o.dueDate}</p>
                  </div>
                  <Badge status={o.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">No overdue tasks 🎉</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
