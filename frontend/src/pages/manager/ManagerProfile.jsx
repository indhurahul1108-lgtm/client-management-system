import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { User, Phone, MapPin, Calendar, Shield, Lock, Users, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';

function Toast({ msg, color, onClose }) {
  return <div className={`fixed top-4 right-4 z-50 ${color} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold`}><CheckCircle size={16}/>{msg}</div>;
}

export default function ManagerProfile() {
  const { user } = useAuth();
  const myStaffCount = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === user?.managerId).length;
  const [toast, setToast] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });

  const showToast = (msg, color = 'bg-green-600') => { setToast({ msg, color }); setTimeout(() => setToast(''), 3000); };

  const changePw = () => {
    if (!pw.current || !pw.newPw || !pw.confirm) return showToast('Fill all fields', 'bg-red-500');
    if (pw.newPw !== pw.confirm) return showToast('Passwords do not match', 'bg-red-500');
    if (pw.newPw.length < 6) return showToast('Min 6 characters', 'bg-red-500');
    setPw({ current: '', newPw: '', confirm: '' });
    showToast('✅ Password changed successfully!');
  };

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 py-3.5 border-b border-slate-50 last:border-0">
      <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
      <div><p className="text-xs text-slate-400 font-semibold uppercase">{label}</p><p className="text-sm font-semibold text-slate-700 mt-0.5">{value || '—'}</p></div>
    </div>
  );

  return (
    <DashboardLayout title="My Profile">
      {toast && <Toast msg={toast.msg} color={toast.color} onClose={() => setToast('')} />}

      {/* Cover */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-5">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-800 relative">
          <div className="absolute -bottom-10 left-6">
            <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=7c3aed&color=fff&size=128`}
              alt="" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"/>
          </div>
        </div>
        <div className="pt-12 px-6 pb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.managerId?.toUpperCase()}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Manager</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center bg-purple-50 rounded-xl p-3 min-w-[70px]">
              <p className="text-xl font-bold text-purple-700">{myStaffCount}</p>
              <p className="text-xs text-slate-400">My Staff</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Information</h3>
          <InfoRow icon={<User size={15} className="text-purple-500"/>}     label="Full Name"   value={user?.name} />
          <InfoRow icon={<Phone size={15} className="text-purple-500"/>}    label="Mobile"      value={user?.mobile} />
          <InfoRow icon={<MapPin size={15} className="text-purple-500"/>}   label="Address"     value={user?.address} />
          <InfoRow icon={<Calendar size={15} className="text-purple-500"/>} label="Joined"      value={user?.joinDate} />
          <InfoRow icon={<Shield size={15} className="text-purple-500"/>}   label="Manager ID"  value={user?.managerId?.toUpperCase()} />
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock size={13}/> Change Password</h3>
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password',     key: 'newPw' },
            { label: 'Confirm Password', key: 'confirm' },
          ].map(f => (
            <div key={f.key} className="mb-3">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">{f.label}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={pw[f.key]}
                  onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                {f.key === 'current' && (
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-slate-400">
                    {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={changePw} className="w-full mt-2 bg-purple-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition">
            Update Password
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
