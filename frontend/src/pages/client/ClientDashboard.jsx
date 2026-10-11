import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  IndianRupee, 
  Phone, 
  User, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  // Assigned Staff (Field Staff in charge)
  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);
  const assignedManager = DUMMY_USERS.find(u => u.role === 'manager' && (u.name === user?.bunkManager || u.managerId === 'm001'));

  // Quick punch state for demo
  const [punchedToday, setPunchedToday] = useState(false);

  return (
    <DashboardLayout title={lang === 'ta' ? 'கிளைண்ட் பணியாளர் முகப்பு' : 'Candidate Portal'}>

      {/* ── Candidate Personal Deployment Banner ── */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white mb-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/40 shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">{user?.name || 'Karthik Velu'}</h1>
                <span className="text-[11px] bg-emerald-500/20 border border-emerald-300 text-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={12} /> {lang === 'ta' ? 'பணியில் உள்ளார்' : 'Active Deployed'}
                </span>
              </div>
              <p className="text-orange-100 text-xs sm:text-sm font-semibold mt-1">
                {lang === 'ta' ? 'பதவி:' : 'Role:'} <span className="text-white font-bold">{user?.roleAtBunk || 'Fuel Dispenser Attendant'}</span>
                &nbsp;|&nbsp; ID: <span className="font-mono text-amber-200">{user?.clientId?.toUpperCase() || 'C001'}</span>
              </p>
              <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                <MapPin size={13} className="shrink-0" />
                <span>{user?.address || 'Chennai, Tamil Nadu'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/client/checkin"
              className="flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition shadow-lg"
            >
              <Clock size={16} /> {lang === 'ta' ? 'இன்றைய வருகை பதிவு' : 'Punch Attendance'}
            </Link>
          </div>
        </div>

        {/* Deployment Location Banner */}
        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs relative z-10">
          <div className="bg-black/20 rounded-2xl p-3.5 flex items-center gap-3 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 bg-white/20 rounded-xl text-white shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'ஒதுக்கப்பட்ட பெட்ரோல் பங்க்' : 'Assigned Petrol Bunk'}
              </p>
              <p className="font-bold text-white text-xs sm:text-sm">{user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'}</p>
              <p className="text-orange-200 text-[11px] mt-0.5">{user?.bunkLocation || 'Chennai, Tamil Nadu'}</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3.5 flex items-center gap-3 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 bg-white/20 rounded-xl text-white shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'பணி ஷிப்ட் நேரம்' : 'Duty Shift Schedule'}
              </p>
              <p className="font-bold text-white text-xs sm:text-sm">{user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'}</p>
              <p className="text-orange-200 text-[11px] mt-0.5">
                {lang === 'ta' ? 'மேலாளர்:' : 'Manager:'} {user?.bunkManager || 'Priya Nair'} (📞 {user?.bunkManagerPhone || '9000000002'})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Overview Cards (Salary, Shift, Attendance, Staff) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Monthly Salary Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                ₹{(user?.salary || 18500).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta' ? 'மாத சம்பளம்' : 'Monthly Salary'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-green-700 font-semibold mt-2.5 pt-2 border-t border-slate-100">
            <span>{lang === 'ta' ? 'அட்மின் நிர்ணயித்தது' : 'Set by Management'}</span>
            <span className="bg-green-50 px-2 py-0.5 rounded-full">GPay / Bank</span>
          </div>
        </div>

        {/* Current Shift */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 leading-tight">
                {user?.shift?.split(':')[1]?.split('(')[0]?.trim() || 'Morning'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta' ? 'ஷிப்ட் முறை' : 'Current Shift'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-mono">
            {user?.shift?.split('(')[1]?.replace(')', '') || '06:00 AM - 02:00 PM'}
          </p>
        </div>

        {/* Attendance Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {punchedToday ? 'Present' : '100%'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta' ? 'மாத வருகை' : 'Month Attendance'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-purple-700 font-semibold mt-2.5 pt-2 border-t border-slate-100">
            {lang === 'ta' ? 'போட்டோ & GPS சரிபார்ப்பு' : 'Selfie & GPS Verified'}
          </p>
        </div>

        {/* Incharge Staff */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <User size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 leading-tight truncate">
                {assignedStaff?.name || 'Anitha Devi'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta' ? 'மேற்பார்வை ஸ்டாப்' : 'Assigned Staff'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-mono">
            📞 {assignedStaff?.mobile || '9000000004'}
          </p>
        </div>
      </div>

      {/* ── Detailed Deployment & Work Information ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Left Column: Work & Bunk Duties (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Punch Action Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-orange-600" />
                  {lang === 'ta' ? 'இன்றைய பங்க் வருகை பதிவு (Selfie Punch)' : "Today's Bunk Punch In / Out"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ta' ? 'பங்க் இடத்தில் இருந்து கேமரா செல்ஃபி எடுத்து பதிவு செய்யவும்' : 'Punch attendance at your assigned bunk location'}
                </p>
              </div>
              <Link
                to="/client/checkin"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                {lang === 'ta' ? 'முழு பக்கம்' : 'Full Page'} <ChevronRight size={14} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  IOCL
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{user?.assignedBunk || 'Indian Oil Petrol Bunk'}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-orange-600" /> {user?.bunkLocation || 'Anna Salai, Chennai'}
                  </p>
                  <p className="text-[11px] text-orange-700 font-semibold mt-1">
                    {user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/client/checkin"
                  className="flex-1 sm:flex-none text-center bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  🟢 {lang === 'ta' ? 'பணி தொடங்கு (Punch In)' : 'Punch In'}
                </Link>
                <Link
                  to="/client/checkin"
                  className="flex-1 sm:flex-none text-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  🔴 {lang === 'ta' ? 'பணி முடி (Punch Out)' : 'Punch Out'}
                </Link>
              </div>
            </div>
          </div>

          {/* Deployment Duties & Job Guidelines */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-orange-600" />
              {lang === 'ta' ? 'உங்கள் பங்க் பணிகள் & விதிமுறைகள்' : 'My Bunk Job Responsibilities'}
            </h2>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Fuel Dispensing & Safety', desc: 'Maintain clean uniform, safety shoes, and follow no-smoking / safety protocols on nozzles.', taTitle: 'எரிபொருள் போடுதல் & பாதுகாப்பு', taDesc: 'சீரான உடை, பாதுகாப்பு காலணிகள் அணிந்து பாதுகாப்பு விதிகளை தவறாது பின்பற்றவும்.' },
                { title: 'POS / Cash Reconciliation', desc: 'Collect cash and credit card payments accurately and deposit with the bunk cashier at shift end.', taTitle: 'பணம் & கார்டு வசூல்', taDesc: 'பணம் மற்றும் கார்டு வசூலை சரியாக கணக்கு வைத்து ஷிப்ட் முடிவில் கேஷியரிடம் ஒப்படைக்கவும்.' },
                { title: 'Shift Handover & Log', desc: 'Ensure smooth meter reading handover to the next incoming shift attendant.', taTitle: 'ஷிப்ட் ஒப்படைப்பு', taDesc: 'அடுத்த ஷிப்ட் பணியாளரிடம் மீட்டர் அளவுகளை சரியாக சரிபார்த்து ஒப்படைக்கவும்.' },
                { title: 'Emergency Management Contact', desc: `In case of machine issues or fuel stock shortages, notify Manager ${user?.bunkManager || 'Priya Nair'} immediately.`, taTitle: 'அவசர உதவிக்கு மேலாளர் தொடர்பு', taDesc: `இயந்திர கோளாறு அல்லது பிரச்சனை ஏற்பட்டால் உடனடியாக மேலாளரை அழைக்கவும்: ${user?.bunkManagerPhone || '9000000002'}` },
              ].map((item, i) => (
                <div key={i} className="p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-100 transition flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{lang === 'ta' ? item.taTitle : item.title}</p>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{lang === 'ta' ? item.taDesc : item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Personal KYC & Salary Details */}
        <div className="space-y-6">

          {/* Salary Breakdown Box */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <IndianRupee size={16} className="text-green-600" />
              {lang === 'ta' ? 'சம்பள விபரம் (Management Fixed)' : 'Salary Structure'}
            </h3>

            <div className="bg-emerald-50 border border-emerald-200/70 rounded-2xl p-4 text-center mb-4">
              <p className="text-xs text-emerald-700 font-semibold uppercase">{lang === 'ta' ? 'மாதாந்திர நிகர தொகை' : 'Monthly Net Payout'}</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">₹{(user?.salary || 18500).toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-600 mt-1">{lang === 'ta' ? 'ELAKIYAA நிர்வாகத்தால் நிர்ணயிக்கப்பட்டது' : 'Direct Management Payout'}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'ta' ? 'அடிப்படை சம்பளம்' : 'Basic Pay'}</span>
                <span className="font-semibold text-slate-700">₹{((user?.salary || 18500) - 2500).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'ta' ? 'ஷிப்ட் அலவன்ஸ்' : 'Shift Allowance'}</span>
                <span className="font-semibold text-green-600">+₹2,500</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'ta' ? 'பேமென்ட் முறை' : 'Payment Mode'}</span>
                <span className="font-semibold text-blue-600">GPay / Bank Transfer</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">{lang === 'ta' ? 'வங்கி கணக்கு' : 'Bank Account'}</span>
                <span className="font-mono text-slate-700">{user?.bankAccount || 'SBI - 30894512903'}</span>
              </div>
            </div>
          </div>

          {/* Candidate ID & Contacts Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <User size={16} className="text-orange-600" />
              {lang === 'ta' ? 'பணியாளர் விவரம் (Profile)' : 'Candidate Details'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ta' ? 'முழு பெயர்' : 'Full Name'}</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.name}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ta' ? 'மொபைல் & GPay' : 'Mobile / GPay'}</p>
                <p className="font-bold font-mono text-slate-800 text-sm mt-0.5">📞 {user?.mobile}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ta' ? 'ஆதார் எண்' : 'Aadhaar (KYC)'}</p>
                <p className="font-bold font-mono text-slate-800 text-sm mt-0.5">{user?.aadhaar || 'XXXX-XXXX-4512'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ta' ? 'சேர்ந்த நாள்' : 'Date of Joining'}</p>
                <p className="font-semibold text-slate-700 text-xs mt-0.5">{user?.joinDate || '2023-01-15'}</p>
              </div>
            </div>

            <Link
              to="/client/profile"
              className="mt-4 block text-center w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-xs transition"
            >
              {lang === 'ta' ? 'முழு சுயவிபரம் பார்க்க' : 'View Full Profile'}
            </Link>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}
