import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Fuel, Users, Clock, CalendarCheck, ShieldCheck, MapPin, Phone, CheckCircle, FileText, Bell, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuth();
  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);
  const assignedManager = DUMMY_USERS.find(u => u.role === 'manager' && (u.managerId === user?.assignedManagerId || u.managerId === 'm001'));

  // Today's Staff on duty at this petrol bunk
  const todayStaff = [
    { name: 'Anitha Devi', role: 'Lead Fuel Operator', shift: 'Morning Shift (06:00 AM - 02:00 PM)', punchIn: '05:55 AM', status: 'On Duty', phone: '9000000004' },
    { name: 'Murugan P', role: 'Cashier & POS Incharge', shift: 'Evening Shift (02:00 PM - 10:00 PM)', punchIn: '01:58 PM', status: 'On Duty', phone: '9000000005' },
    { name: 'Vijay S', role: 'Night Highway Attendant', shift: 'Night Shift (10:00 PM - 06:00 AM)', punchIn: 'Pending', status: 'Upcoming', phone: '9000000011' },
    { name: 'Deepa S', role: 'Nozzle Attendant', shift: 'Morning Shift (06:00 AM - 02:00 PM)', punchIn: '06:00 AM', status: 'On Duty', phone: '9000000006' },
  ];

  return (
    <DashboardLayout title="Petrol Bunk Client Portal">

      {/* Official ELAKIYAA Petrol Bunk Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white mb-6 shadow-xl border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shrink-0">
              <Fuel size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">{user?.name || 'Indian Oil Petrol Bunk (IOCL)'}</h1>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> 24/7 Bunk Active
                </span>
              </div>
              <p className="text-orange-300 text-xs mt-0.5 font-medium">
                Contract: <span className="font-bold text-white">ELAKIYAA Manpower Supply</span> &nbsp;|&nbsp; Bunk Code: {user?.clientId?.toUpperCase() || 'C001'}
              </p>
              <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                <MapPin size={11} /> {user?.address || 'Anna Salai, Chennai, Tamil Nadu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/client/requests"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
            >
              <Users size={14} /> Request Extra Bunk Staff
            </Link>
          </div>
        </div>

        {/* Bunk Field Manager Card */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {assignedManager && (
            <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
              <img src={assignedManager.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div>
                <p className="text-purple-300 text-[10px] font-semibold uppercase">ELAKIYAA Bunk Field Manager</p>
                <p className="font-bold text-white text-xs">{assignedManager.name}</p>
                <p className="text-slate-300 text-[11px] font-mono">📞 {assignedManager.mobile} (Direct Contact)</p>
              </div>
            </div>
          )}
          <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
            <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              3S
            </div>
            <div>
              <p className="text-emerald-300 text-[10px] font-semibold uppercase">Shift Schedule Coverage</p>
              <p className="font-bold text-white text-xs">Morning (6-2) · Evening (2-10) · Night (10-6)</p>
              <p className="text-slate-300 text-[11px]">Continuous 24-Hour Bunk Manning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Deployed Attendants', value: '4 Staff', color: 'blue', icon: <Users size={18} className="text-white" />, sub: 'Fuel Crew on Duty' },
          { label: 'Current Active Shift', value: 'Morning (6-2)', color: 'green', icon: <Clock size={18} className="text-white" />, sub: '2 Operators on Pumps' },
          { label: 'Shift Attendance', value: '100% Present', color: 'purple', icon: <CheckCircle size={18} className="text-white" />, sub: 'GPS & Camera Verified' },
          { label: 'October Bunk Bill', value: '₹1,35,000', color: 'orange', icon: <TrendingUp size={18} className="text-white" />, sub: 'Salary & Service Payout' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${s.color}-600 rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
              <div>
                <p className="text-lg font-bold text-slate-800 leading-tight">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Bunk Fuel Operators Currently on Duty ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <Fuel size={16} className="text-orange-500" /> Bunk Staff on Duty Today
            </h3>
            <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Live Shift</span>
          </div>
          <div className="divide-y divide-slate-50">
            {todayStaff.map((st, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{st.name}</p>
                    <p className="text-[11px] text-slate-500">{st.role} · 📞 {st.phone}</p>
                    <p className="text-[10px] text-purple-700 font-medium">{st.shift}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${st.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {st.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">In: {st.punchIn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3-Month Manpower Cost & Attendance History ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <CalendarCheck size={16} className="text-blue-600" /> 3-Month Staff Salary & Bunk Billing
            </h3>
            <span className="text-xs text-slate-400">Quarterly History</span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { month: 'October 2026 (Current)', days: 28, staff: 4, salaryPaid: '₹1,35,000', bill: '₹1,62,000', status: 'Running' },
              { month: 'September 2026', days: 30, staff: 4, salaryPaid: '₹1,42,000', bill: '₹1,70,400', status: 'Settled' },
              { month: 'August 2026', days: 31, staff: 4, salaryPaid: '₹1,38,000', bill: '₹1,65,600', status: 'Settled' },
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-xs">{m.month}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.staff} Attendants · {m.days} Operational Days</p>
                  <p className="text-[10px] text-slate-400 font-mono">Staff Salary Paid: {m.salaryPaid}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-xs font-mono">{m.bill}</p>
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                    ✓ {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Request Additional Staff / Replacements ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
            <FileText size={16} className="text-purple-600" /> Need Extra Attendants or Shift Replacement?
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            For festival rush, highway traffic peak hours, or machine maintenance, submit a request for emergency fuel attendants or cashiers. ELAKIYAA deploys replacements within 2 hours.
          </p>
          <div className="flex gap-3">
            <Link
              to="/client/requests"
              className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold text-center transition"
            >
              + Submit Staff Request
            </Link>
            <Link
              to="/client/messages"
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center transition"
            >
              Chat with Manager
            </Link>
          </div>
        </div>

        {/* ── Bunk Emergency Support & Hotline ── */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/60 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-orange-900 text-sm mb-1">ELAKIYAA 24/7 Bunk Support Desk</h3>
            <p className="text-xs text-orange-700 mb-3">
              Direct hotline for pump station managers, shift replacements, and urgent night shift coverage.
            </p>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-2 text-slate-700">
                <span className="font-bold">Hotline:</span> <span className="font-mono text-orange-800 font-bold">+91 90000 00002</span>
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <span className="font-bold">Email:</span> <span className="text-slate-600">support@elakiyaa.com</span>
              </p>
            </div>
          </div>
          <p className="text-[10px] text-orange-600 mt-4 pt-2 border-t border-orange-200">
            ELAKIYAA — JOBS MADE SIMPLE · Leading Petrol Bunk Workforce Solutions
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
