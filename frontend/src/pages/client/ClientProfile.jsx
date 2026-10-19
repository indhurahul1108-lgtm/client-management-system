import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { User, Phone, MapPin, Building2, Briefcase, Calendar, Shield, UserCheck, IndianRupee, Clock, CreditCard, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientProfile() {
  const { user } = useAuth();
  
  const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
  const assignedStaffIds = user?.assignedStaffIds || (user?.assignedStaffId ? [user.assignedStaffId] : ['s001', 's002']);
  const assignedStaffMembers = staffList.filter(s => assignedStaffIds.includes(s.staffId || s.id));
  const primaryStaff = assignedStaffMembers[0] || { name: 'Anitha Devi', mobile: '9000000004', staffId: 's001' };

  const assignedManager = DUMMY_USERS.find(u => u.name === user?.bunkManager || (u.role === 'manager' && u.managerId === 'm001')) || {
    name: 'Priya Nair',
    mobile: '9000000002',
    managerId: 'm001'
  };

  const InfoRow = ({ icon, label, value, highlight }) => (
    <div className={`flex items-start gap-3 py-3.5 border-b border-slate-50 last:border-0 ${highlight ? 'bg-orange-50/40 -mx-5 px-5 rounded-xl' : ''}`}>
      <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-orange-600">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-orange-700' : 'text-slate-800'}`}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="My Profile">

      {/* Cover + Avatar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="h-36 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 relative">
          <div className="absolute -bottom-12 left-6">
            <img
              src={user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
            />
          </div>
        </div>
        <div className="pt-16 px-6 pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-slate-800">{user?.name}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Active Deployed Candidate
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                {user?.roleAtBunk || 'Fuel Dispenser Attendant'} &nbsp;·&nbsp;
                ID: <span className="font-mono font-bold text-orange-600">{user?.clientId?.toUpperCase() || 'C001'}</span>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500">
              <p>Date of Joining</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.joinDate || '2023-01-15'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <User size={16} className="text-orange-600" /> Personal Information
          </h3>
          <InfoRow icon={<User size={16} />} label="Full Name" value={user?.name} />
          <InfoRow icon={<Phone size={16} />} label="Mobile Phone" value={user?.mobile} />
          <InfoRow icon={<MapPin size={16} />} label="Address" value={user?.address} />
          <InfoRow icon={<Shield size={16} />} label="Aadhaar KYC" value={user?.aadhaar || 'XXXX-XXXX-4512'} />
        </div>

        {/* Assigned Bunk & Deployment */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <Building2 size={16} className="text-orange-600" /> Assigned Petrol Bunk Station
          </h3>
          <InfoRow 
            icon={<Building2 size={16} />} 
            label="Petrol Bunk Station" 
            value={user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'} 
            highlight 
          />
          <InfoRow icon={<MapPin size={16} />} label="Station Location" value={user?.bunkLocation || 'Chennai, Tamil Nadu'} />
          <InfoRow icon={<Clock size={16} />} label="Duty Shift" value={user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'} />
          <InfoRow icon={<Briefcase size={16} />} label="Role at Bunk" value={user?.roleAtBunk || 'Fuel Dispenser Attendant'} />
        </div>

        {/* Salary & Bank Info (Set by Management) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <IndianRupee size={16} className="text-green-600" /> Salary & Bank Details
          </h3>
          <InfoRow 
            icon={<IndianRupee size={16} />} 
            label="Monthly Salary (Fixed by Management)" 
            value={`₹${(user?.salary || 18500).toLocaleString('en-IN')}`} 
            highlight 
          />
          <InfoRow icon={<CreditCard size={16} />} label="Bank Account" value={user?.bankAccount || 'SBI - 30894512903'} />
          <InfoRow icon={<Phone size={16} />} label="GPay Mobile Number" value={user?.gpayNumber || user?.mobile} />
        </div>

        {/* Incharge Team Contacts */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <UserCheck size={16} className="text-purple-600" /> Management & Supervising Staff Contacts
          </h3>
          
          <div className="space-y-4">
            {/* Manager */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                M
              </div>
              <div>
                <p className="text-[10px] text-purple-700 font-bold uppercase">Field Manager</p>
                <p className="font-bold text-slate-800 text-sm">{user?.bunkManager || assignedManager?.name || 'Priya Nair'}</p>
                <p className="text-xs text-slate-600 mt-0.5">📞 {user?.bunkManagerPhone || assignedManager?.mobile || '9000000002'}</p>
              </div>
            </div>

            {/* Supervising Staff Members */}
            {assignedStaffMembers.map(st => (
              <div key={st.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
                <img src={st.photo} alt={st.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div>
                  <p className="text-[10px] text-orange-700 font-bold uppercase">Assigned Staff Supervisor</p>
                  <p className="font-bold text-slate-800 text-sm">{st.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">📞 {st.mobile}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}
