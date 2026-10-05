import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Phone, MapPin, Calendar, Briefcase, Edit } from 'lucide-react';

export default function StaffProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl mx-auto">
        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-green-600 to-green-800" />
          {/* Avatar */}
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-6">
              <img src={user.photo} alt={user.name}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover" />
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition">
                <Edit size={14} /> Edit Profile
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Staff Member</span>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Mobile Number', value: user.mobile },
                { icon: MapPin, label: 'Address', value: user.address },
                { icon: Calendar, label: 'Join Date', value: user.joinDate },
                { icon: Briefcase, label: 'Role', value: 'Staff Member' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Work Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-sm text-slate-500">Staff ID</span>
                <span className="text-sm font-semibold text-slate-700">{user.staffId?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-sm text-slate-500">Basic Salary</span>
                <span className="text-sm font-semibold text-slate-700">₹{user.salary?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-slate-500">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
