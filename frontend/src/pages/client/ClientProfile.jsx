import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { User, Phone, MapPin, Building2, Briefcase, Calendar, Shield, UserCheck } from 'lucide-react';

export default function ClientProfile() {
  const { user } = useAuth();
  const assignedStaff   = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);
  const assignedManager = DUMMY_USERS.find(u => u.managerId === assignedStaff?.managerId && u.role === 'manager');

  const InfoRow = ({ icon, label, value, highlight }) => (
    <div className={`flex items-start gap-3 py-3.5 border-b border-slate-50 last:border-0 ${highlight ? 'bg-orange-50/40 -mx-5 px-5 rounded-xl' : ''}`}>
      <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-orange-700' : 'text-slate-700'}`}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="My Profile">

      {/* Cover + Avatar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-5">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-amber-400 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'C')}&background=f97316&color=fff&size=128`}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          </div>
        </div>
        <div className="pt-12 px-6 pb-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-400 text-sm">{user?.clientId?.toUpperCase()}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Client</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {user?.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Member since</p>
              <p className="font-semibold text-slate-600">{user?.joinDate || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <User size={15} className="text-orange-500" /> Personal Information
          </h3>
          <InfoRow icon={<User size={15} className="text-orange-500" />}     label="Full Name"    value={user?.name} />
          <InfoRow icon={<Phone size={15} className="text-orange-500" />}    label="Mobile"       value={user?.mobile} />
          <InfoRow icon={<MapPin size={15} className="text-orange-500" />}   label="Address"      value={user?.address} />
          <InfoRow icon={<Calendar size={15} className="text-orange-500" />} label="Joined Date"  value={user?.joinDate} />
        </div>

        {/* Service Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <Briefcase size={15} className="text-orange-500" /> Service Details
          </h3>
          <InfoRow icon={<Briefcase size={15} className="text-orange-500" />} label="Service Type" value={user?.service} highlight />
          <InfoRow icon={<Shield size={15} className="text-orange-500" />}    label="Client ID"    value={user?.clientId?.toUpperCase()} />
          <InfoRow icon={<Building2 size={15} className="text-orange-500" />} label="Status"       value={user?.status === 'active' ? '✅ Active' : '❌ Inactive'} />
        </div>

        {/* Assigned Team */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <UserCheck size={15} className="text-orange-500" /> Your Dedicated Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned Staff */}
            {assignedStaff ? (
              <div className="flex items-center gap-4 bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <img src={assignedStaff.photo} alt={assignedStaff.name} className="w-14 h-14 rounded-xl object-cover border-2 border-orange-200" />
                <div>
                  <p className="text-xs text-orange-500 font-semibold uppercase">Assigned Staff</p>
                  <p className="font-bold text-slate-800">{assignedStaff.name}</p>
                  <p className="text-sm text-slate-500">📞 {assignedStaff.mobile}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-4 text-center text-slate-400 text-sm border border-slate-100">No staff assigned</div>
            )}
            {/* Assigned Manager */}
            {assignedManager ? (
              <div className="flex items-center gap-4 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <img src={assignedManager.photo} alt={assignedManager.name} className="w-14 h-14 rounded-xl object-cover border-2 border-purple-200" />
                <div>
                  <p className="text-xs text-purple-500 font-semibold uppercase">Manager</p>
                  <p className="font-bold text-slate-800">{assignedManager.name}</p>
                  <p className="text-sm text-slate-500">📞 {assignedManager.mobile}</p>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <p className="text-xs text-purple-500 font-semibold uppercase mb-1">Manager</p>
                <p className="text-sm text-slate-500">Contact admin for manager info</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Note */}
      <div className="mt-5 bg-orange-50 border border-orange-100 rounded-2xl p-4 text-orange-700 text-sm">
        🔒 To update your profile information, please contact your assigned staff or reach out to our admin.
      </div>
    </DashboardLayout>
  );
}
