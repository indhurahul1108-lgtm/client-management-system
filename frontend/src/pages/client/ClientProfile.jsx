import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { User, Phone, MapPin, Building2, Briefcase, Calendar, Shield, UserCheck, IndianRupee, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientProfile() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const assignedStaff   = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);
  const assignedManager = DUMMY_USERS.find(u => u.name === user?.bunkManager || (u.role === 'manager' && u.managerId === 'm001'));

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
    <DashboardLayout title={lang === 'ta' ? 'பணியாளர் சுயவிபரம் (Candidate Profile)' : 'My Profile'}>

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
                  {lang === 'ta' ? 'பணியில் உள்ளார்' : 'Active Deployed Candidate'}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                {user?.roleAtBunk || 'Fuel Dispenser Attendant'} &nbsp;·&nbsp;
                ID: <span className="font-mono font-bold text-orange-600">{user?.clientId?.toUpperCase() || 'C001'}</span>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500">
              <p>{lang === 'ta' ? 'சேர்ந்த நாள் (Joining Date)' : 'Date of Joining'}</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.joinDate || '2023-01-15'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <User size={16} className="text-orange-600" /> {lang === 'ta' ? 'தனிநபர் விவரங்கள்' : 'Personal Information'}
          </h3>
          <InfoRow icon={<User size={16} />} label={lang === 'ta' ? 'முழு பெயர்' : 'Full Name'} value={user?.name} />
          <InfoRow icon={<Phone size={16} />} label={lang === 'ta' ? 'மொபைல் எண் (Mobile)' : 'Mobile Phone'} value={user?.mobile} />
          <InfoRow icon={<MapPin size={16} />} label={lang === 'ta' ? 'முகவரி (Residential Address)' : 'Address'} value={user?.address} />
          <InfoRow icon={<Shield size={16} />} label={lang === 'ta' ? 'ஆதார் KYC' : 'Aadhaar Number'} value={user?.aadhaar || 'XXXX-XXXX-4512'} />
        </div>

        {/* Assigned Bunk & Deployment */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <Building2 size={16} className="text-orange-600" /> {lang === 'ta' ? 'ஒதுக்கப்பட்ட பெட்ரோல் பங்க் பணி' : 'Assigned Petrol Bunk'}
          </h3>
          <InfoRow 
            icon={<Building2 size={16} />} 
            label={lang === 'ta' ? 'பெட்ரோல் பங்க் பெயர்' : 'Petrol Bunk'} 
            value={user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'} 
            highlight 
          />
          <InfoRow icon={<MapPin size={16} />} label={lang === 'ta' ? 'பங்க் இடம்' : 'Station Location'} value={user?.bunkLocation || 'Chennai, Tamil Nadu'} />
          <InfoRow icon={<Clock size={16} />} label={lang === 'ta' ? 'ஷிப்ட் நேரம்' : 'Duty Shift'} value={user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'} />
          <InfoRow icon={<Briefcase size={16} />} label={lang === 'ta' ? 'பணி பதவி' : 'Role at Bunk'} value={user?.roleAtBunk || 'Fuel Dispenser Attendant'} />
        </div>

        {/* Salary & Bank Info (Set by Management) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <IndianRupee size={16} className="text-green-600" /> {lang === 'ta' ? 'சம்பளம் & வங்கி கணக்கு' : 'Salary & Bank Details'}
          </h3>
          <InfoRow 
            icon={<IndianRupee size={16} />} 
            label={lang === 'ta' ? 'மாத சம்பளம் (Fixed by Sir/Admin)' : 'Monthly Salary (Fixed)'} 
            value={`₹${(user?.salary || 18500).toLocaleString('en-IN')}`} 
            highlight 
          />
          <InfoRow icon={<CreditCard size={16} />} label={lang === 'ta' ? 'வங்கி கணக்கு' : 'Bank Account'} value={user?.bankAccount || 'SBI - 30894512903'} />
          <InfoRow icon={<Phone size={16} />} label={lang === 'ta' ? 'GPay எண்' : 'GPay Mobile'} value={user?.gpayNumber || user?.mobile} />
        </div>

        {/* Incharge Team Contacts */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <UserCheck size={16} className="text-purple-600" /> {lang === 'ta' ? 'மேலாளர் & மேற்பார்வை ஸ்டாப்' : 'Management & Staff Contacts'}
          </h3>
          
          <div className="space-y-4">
            {/* Manager */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base">
                M
              </div>
              <div>
                <p className="text-[10px] text-purple-700 font-bold uppercase">{lang === 'ta' ? 'பங்க் பீல்டு மேலாளர்' : 'Field Manager'}</p>
                <p className="font-bold text-slate-800 text-sm">{user?.bunkManager || assignedManager?.name || 'Priya Nair'}</p>
                <p className="text-xs text-slate-600 mt-0.5">📞 {user?.bunkManagerPhone || assignedManager?.mobile || '9000000002'}</p>
              </div>
            </div>

            {/* Staff */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base">
                S
              </div>
              <div>
                <p className="text-[10px] text-orange-700 font-bold uppercase">{lang === 'ta' ? 'மேற்பார்வை ஸ்டாப்' : 'Assigned Field Staff'}</p>
                <p className="font-bold text-slate-800 text-sm">{assignedStaff?.name || 'Anitha Devi'}</p>
                <p className="text-xs text-slate-600 mt-0.5">📞 {assignedStaff?.mobile || '9000000004'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}
