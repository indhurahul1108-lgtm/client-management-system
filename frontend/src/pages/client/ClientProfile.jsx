import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Building2, Briefcase, Calendar, Edit2 } from 'lucide-react';

export default function ClientProfile() {
  const { user } = useAuth();

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="My Profile">
      {/* Cover + Avatar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-5">
        <div className="h-28 bg-gradient-to-r from-orange-500 to-amber-400 relative">
          <div className="absolute -bottom-10 left-6">
            <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff&size=128`}
              alt={user?.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
          </div>
        </div>
        <div className="pt-12 px-6 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-400 text-sm">{user?.clientId?.toUpperCase()}</p>
              <span className="inline-block mt-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">Client</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={17} className="text-orange-500" /> Personal Information
          </h3>
          <InfoRow icon={<User size={15} className="text-orange-500" />}     label="Full Name"     value={user?.name} />
          <InfoRow icon={<Phone size={15} className="text-orange-500" />}    label="Mobile"        value={user?.mobile} />
          <InfoRow icon={<MapPin size={15} className="text-orange-500" />}   label="Address"       value={user?.address} />
          <InfoRow icon={<Calendar size={15} className="text-orange-500" />} label="Member Since"  value={user?.joinDate} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase size={17} className="text-orange-500" /> Service Information
          </h3>
          <InfoRow icon={<Briefcase size={15} className="text-orange-500" />} label="Service Type"  value={user?.service} />
          <InfoRow icon={<Building2 size={15} className="text-orange-500" />} label="Status"        value={user?.status} />
          <InfoRow icon={<User size={15} className="text-orange-500" />}      label="Assigned Staff" value={user?.assignedStaffId} />
        </div>
      </div>

      {/* Note */}
      <div className="mt-5 bg-orange-50 border border-orange-100 rounded-2xl p-4 text-orange-700 text-sm">
        📞 To update your profile information, please contact your assigned staff or admin.
      </div>
    </DashboardLayout>
  );
}
