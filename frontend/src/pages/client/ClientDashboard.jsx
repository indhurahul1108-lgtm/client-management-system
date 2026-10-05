import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { Building2, User, Phone, MapPin, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user.assignedStaffId);
  const myOverdue = DUMMY_OVERDUE.filter(o => o.clientId === user.clientId);
  const overdueCount   = myOverdue.filter(o => o.status === 'overdue').length;
  const completedCount = myOverdue.filter(o => o.status === 'completed').length;
  const pendingCount   = myOverdue.filter(o => o.status === 'pending').length;

  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-6 text-white mb-8 flex items-center justify-between">
        <div>
          <p className="text-orange-200 text-sm">Welcome,</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-orange-200 text-sm mt-1">Client Account · {user.service}</p>
        </div>
        <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-2xl border-2 border-white/30 object-cover" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-red-700">{overdueCount}</p>
          <p className="text-sm text-red-600 font-medium mt-1">Overdue</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-yellow-700">{pendingCount}</p>
          <p className="text-sm text-yellow-600 font-medium mt-1">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-green-700">{completedCount}</p>
          <p className="text-sm text-green-600 font-medium mt-1">Completed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-800 mb-4">My Account</h2>
          <div className="space-y-3">
            {[
              { icon: Building2, label: 'Company / Name', value: user.name },
              { icon: Phone, label: 'Mobile', value: user.mobile },
              { icon: MapPin, label: 'Address', value: user.address },
              { icon: CheckCircle, label: 'Service', value: user.service },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon size={15} className="text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Account Status</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Staff */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-800 mb-4">My Assigned Staff</h2>
          {assignedStaff ? (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <img src={assignedStaff.photo} alt={assignedStaff.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-slate-800">{assignedStaff.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">Staff Member</p>
                <p className="text-sm text-blue-600 mt-0.5 flex items-center gap-1">
                  <Phone size={12} /> {assignedStaff.mobile}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No staff assigned yet</div>
          )}

          <h3 className="font-bold text-slate-800 mt-6 mb-3">My Tasks</h3>
          <div className="space-y-3">
            {myOverdue.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-700">{o.task}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Due: {o.dueDate}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                  ${o.status === 'overdue' ? 'bg-red-100 text-red-700' : o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {o.status}
                </span>
              </div>
            ))}
            {myOverdue.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">No tasks assigned</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
