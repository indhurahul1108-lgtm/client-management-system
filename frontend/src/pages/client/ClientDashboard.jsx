import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { printIndividualRecord } from '../../utils/printUtils.js';
import PhoneCallModal from '../../components/PhoneCallModal';
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
  Printer,
  ChevronRight,
  Sparkles,
  Users,
  Check,
  CheckSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuth();

  // Find assigned supervising staff members (supports multi-staff)
  const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
  const assignedStaffIds = user?.assignedStaffIds || (user?.assignedStaffId ? [user.assignedStaffId] : ['s001', 's002']);
  const assignedStaffMembers = staffList.filter(s => assignedStaffIds.includes(s.staffId || s.id));
  const primaryStaff = assignedStaffMembers[0] || { name: 'Anitha Devi', mobile: '9000000004', staffId: 's001' };

  // Manager in charge
  const assignedManager = DUMMY_USERS.find(u => u.role === 'manager' && (u.name === user?.bunkManager || u.managerId === 'm001')) || {
    name: 'Priya Nair',
    mobile: '9000000002',
    managerId: 'm001'
  };

  // Selected date state (defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDutyDate, setSelectedDutyDate] = useState(todayStr);
  const [callingContact, setCallingContact] = useState(null);

  // Client duty approval state (Client confirms presence & assigned station with localStorage sync)
  const [clientApprovedDuties, setClientApprovedDuties] = useState(() => {
    try {
      const clientId = user?.clientId || user?.id || 'c001';
      const stored = JSON.parse(localStorage.getItem('cms_duty_confirmations') || '{}');
      const userConf = stored[clientId];
      return {
        [todayStr]: {
          approved: userConf?.confirmed || false,
          approvedAt: userConf?.confirmedAt || null,
        },
        '2026-10-10': {
          approved: true,
          approvedAt: '06:08 AM',
        },
        '2026-10-09': {
          approved: true,
          approvedAt: '06:05 AM',
        },
      };
    } catch {
      return {
        [todayStr]: { approved: false, approvedAt: null },
        '2026-10-10': { approved: true, approvedAt: '06:08 AM' },
        '2026-10-09': { approved: true, approvedAt: '06:05 AM' },
      };
    }
  });

  const [approvalToast, setApprovalToast] = useState('');

  const currentApproval = clientApprovedDuties[selectedDutyDate] || {
    approved: false,
    approvedAt: null,
  };

  const handleClientApproveDuty = (e) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setClientApprovedDuties(prev => ({
      ...prev,
      [selectedDutyDate]: {
        approved: true,
        approvedAt: now,
      }
    }));

    // Sync across portals via localStorage
    const clientId = user?.clientId || user?.id || 'c001';
    const candidateName = user?.name || 'Karthik Velu';
    const bunkName = currentDuty.bunk || user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)';
    const staffId = primaryStaff.staffId || 's001';
    const managerId = assignedManager.managerId || 'm001';

    try {
      // 1. Save duty confirmation status for staff view
      const existingConf = JSON.parse(localStorage.getItem('cms_duty_confirmations') || '{}');
      existingConf[clientId] = {
        confirmed: true,
        confirmedAt: now,
        date: selectedDutyDate,
        bunk: bunkName,
        candidateName,
        staffId,
        managerId,
      };
      localStorage.setItem('cms_duty_confirmations', JSON.stringify(existingConf));

      // 2. Add real-time notification specifically for the Assigned Staff & Reporting Manager
      const existingNotifs = JSON.parse(localStorage.getItem('cms_live_notifications') || '[]');
      const newNotif = {
        id: 'notif_' + Date.now(),
        targetStaffId: staffId,
        targetManagerId: managerId,
        title: `Candidate Arrived & On Duty: ${candidateName}`,
        msg: `${candidateName} confirmed arrival at ${bunkName} for Shift duty at ${now}.`,
        time: new Date().toISOString(),
        icon: '⛽',
        unread: true,
      };
      localStorage.setItem('cms_live_notifications', JSON.stringify([newNotif, ...existingNotifs]));
    } catch (err) {
      console.warn('Failed to sync duty confirmation', err);
    }

    setApprovalToast(`✅ Duty Confirmed at ${now}! Sent to Supervisor ${primaryStaff.name} & Manager ${assignedManager.name}.`);
    setTimeout(() => setApprovalToast(''), 4500);
  };

  // Duty history
  const dutyHistory = user?.dutyHistory && user.dutyHistory.length > 0 ? user.dutyHistory : [
    { date: '2026-10-10', bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)', approvedBy: `${primaryStaff.name} (Staff)`, approvedAt: '06:05 AM', status: 'approved' },
    { date: '2026-10-09', bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)', approvedBy: `${primaryStaff.name} (Staff)`, approvedAt: '06:00 AM', status: 'approved' },
    { date: '2026-10-08', bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)', approvedBy: `${primaryStaff.name} (Staff)`, approvedAt: '06:15 AM', status: 'late' },
    { date: '2026-10-07', bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)', approvedBy: `${primaryStaff.name} (Staff)`, approvedAt: '06:02 AM', status: 'approved' },
    { date: '2026-10-06', bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)', approvedBy: `${primaryStaff.name} (Staff)`, approvedAt: '05:58 AM', status: 'approved' },
  ];

  const currentDuty = dutyHistory.find(d => d.date === selectedDutyDate) || {
    date: selectedDutyDate,
    bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL) — Anna Salai',
    shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
    approvedBy: user?.dutyStatus === 'approved' ? `${primaryStaff.name} (Staff)` : null,
    approvedAt: user?.approvedAt || '06:05 AM',
    status: user?.dutyStatus || 'approved'
  };

  const handlePrintAttendance = () => {
    printIndividualRecord({
      title: 'Candidate / Worker 3-Month Attendance Statement',
      person: {
        name: user?.name || 'Karthik Velu',
        staffId: user?.clientId || 'C001',
        mobile: user?.mobile || '9100000001',
        role: 'Client Candidate',
        roleAtBunk: user?.roleAtBunk || 'Fuel Dispenser Lead Attendant',
        assignedBunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)',
        shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'attendance',
      records: dutyHistory.map(d => ({
        date: d.date,
        punchIn: d.approvedAt || '06:00 AM',
        punchOut: '02:00 PM',
        location: d.bunk,
        status: d.status === 'approved' ? 'present' : d.status,
      }))
    });
  };

  return (
    <DashboardLayout title="Candidate Portal">
      {/* Toast */}
      {approvalToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-medium text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          {approvalToast}
        </div>
      )}

      {/* ── Candidate Personal Deployment Banner ── */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-4 sm:p-6 text-white mb-5 sm:mb-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 sm:border-4 border-white/40 shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide">{user?.name || 'Karthik Velu'}</h1>
                <span className="text-[10px] sm:text-[11px] bg-emerald-500/20 border border-emerald-300 text-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={12} /> Active Deployed
                </span>
              </div>
              <p className="text-orange-100 text-xs sm:text-sm font-semibold mt-1">
                Role: <span className="text-white font-bold">{user?.roleAtBunk || 'Fuel Dispenser Lead Attendant'}</span>
                &nbsp;|&nbsp; ID: <span className="font-mono text-amber-200">{user?.clientId?.toUpperCase() || 'C001'}</span>
              </p>
              <p className="text-orange-200 text-xs mt-0.5 flex items-center gap-1">
                <MapPin size={13} className="shrink-0" />
                <span>{user?.address || 'Chennai, Tamil Nadu'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrintAttendance}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 transition"
            >
              <Printer size={15} />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* Deployment Location Banner */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs relative z-10">
          <div className="bg-black/20 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-white/10 backdrop-blur-sm">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl text-white shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Assigned Petrol Bunk Station
              </p>
              <p className="font-bold text-white text-xs sm:text-sm">{user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'}</p>
              <p className="text-orange-200 text-[10px] sm:text-[11px] mt-0.5">{user?.bunkLocation || 'Anna Salai, Chennai'}</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-white/10 backdrop-blur-sm">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl text-white shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Duty Shift Schedule
              </p>
              <p className="font-bold text-white text-xs sm:text-sm">{user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'}</p>
              <p className="text-orange-200 text-[10px] sm:text-[11px] mt-0.5">
                Manager: {assignedManager.name} (📞 {assignedManager.mobile})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Overview Cards (Salary, Shift, Attendance, Supervising Staff) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        
        {/* Monthly Salary Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <IndianRupee size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                ₹{(user?.salary || 18500).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Monthly Salary</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-green-700 font-semibold mt-2.5 pt-2 border-t border-slate-100">
            <span>Fixed</span>
            <span className="bg-green-50 px-2 py-0.5 rounded-full">GPay / Bank</span>
          </div>
        </div>

        {/* Current Shift */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <Clock size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-800 leading-tight truncate">
                {user?.shift?.split(':')[1]?.split('(')[0]?.trim() || 'Morning'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Assigned Shift</p>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-mono truncate">
            {user?.shift?.split('(')[1]?.replace(')', '') || '06:00 AM - 02:00 PM'}
          </p>
        </div>

        {/* Attendance Approval Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <CheckCircle size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                {currentDuty.status === 'approved' ? 'Approved' : 'Pending'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Duty Status</p>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-2.5 pt-2 border-t border-slate-100 truncate">
            ✓ Field Staff Verified
          </p>
        </div>

        {/* Assigned Staff (Multi-Staff Display) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight truncate">
                {primaryStaff.name}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {assignedStaffMembers.length > 1 ? `+${assignedStaffMembers.length - 1} Staff` : 'Incharge Staff'}
              </p>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-mono truncate">
            📞 {primaryStaff.mobile}
          </p>
        </div>
      </div>

      {/* ── DAILY DUTY BUNK ASSIGNMENT & STAFF APPROVAL (Core Feature) ── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-emerald-600" />
              <span>Daily Bunk Duty Assignment & Verification</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select date to check your duty station assignment and staff verification status
            </p>
          </div>

          {/* Active Date Indicator */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            <Calendar size={14} className="text-emerald-600" />
            <span>Today's Active Duty: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Selected Date Duty Card */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 mb-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg">
                  📅 {currentDuty.date}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  currentDuty.status === 'approved' ? 'bg-emerald-600 text-white shadow-sm' :
                  currentDuty.status === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                }`}>
                  <ShieldCheck size={14} />
                  {currentDuty.status === 'approved' ? '✓ Approved & Verified On Duty' :
                   currentDuty.status === 'late' ? '⚠️ Verified Late on Duty' : '⏳ Awaiting Staff Verification'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Assigned Duty Station</p>
                <p className="text-base sm:text-lg font-black text-slate-800">{currentDuty.bunk}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.bunkLocation || 'Chennai, Tamil Nadu'}</p>
              </div>

              <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                <span className="text-slate-600">
                  ⏰ <strong>Shift:</strong> {currentDuty.shift}
                </span>
                {currentDuty.approvedBy && (
                  <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                    ✓ Verified by {currentDuty.approvedBy} at {currentDuty.approvedAt}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-4 text-left md:text-right shrink-0 shadow-sm w-full md:w-auto">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Duty Verification Model</p>
              <p className="text-xs text-slate-700 mt-1 font-medium max-w-xs">
                Field staff verifies candidate presence directly at the petrol bunk station. Manual client punch in/out is disabled.
              </p>
              <div className="mt-3 flex items-center gap-2 md:justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700">Staff Incharge Verified</span>
              </div>
            </div>
          </div>

          {/* ── Candidate Action: Duty Station Confirmation ── */}
          {currentApproval.approved ? (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    ✓ Station Duty Acknowledged & Confirmed at {currentApproval.approvedAt}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Presence verified at {currentDuty.bunk}. Shift active.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                  ✓ Confirmed & On Duty
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/90 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-orange-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck size={16} className="text-orange-600" />
                    <span>Candidate Action: Confirm Assigned Duty Station</span>
                  </p>
                  <p className="text-xs text-orange-800 mt-1 max-w-xl leading-relaxed">
                    Supervisor <strong>{primaryStaff.name}</strong> & Manager <strong>{assignedManager.name}</strong> have assigned you to <strong>{currentDuty.bunk}</strong>. Click confirm to acknowledge your duty.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClientApproveDuty}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
                >
                  <CheckSquare size={16} />
                  <span>Confirm Duty Station</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Duty History Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Recent Duty Assignment History
          </h3>
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Assigned Petrol Bunk</th>
                  <th className="p-3 text-left">Shift Schedule</th>
                  <th className="p-3 text-left">Verified By Staff</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dutyHistory.map((d, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedDutyDate(d.date)}
                    className={`hover:bg-orange-50/50 cursor-pointer transition ${d.date === selectedDutyDate ? 'bg-orange-50/80 font-semibold' : ''}`}
                  >
                    <td className="p-3 font-mono text-slate-700">{d.date}</td>
                    <td className="p-3 font-bold text-slate-800">{d.bunk}</td>
                    <td className="p-3 text-slate-600">{d.shift}</td>
                    <td className="p-3 text-slate-600">{d.approvedBy || 'Pending'} ({d.approvedAt || '—'})</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        d.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        d.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {d.status === 'approved' ? '✓ Approved' : d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Assigned Supervising Staff Team & Job Guidelines ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Left Column: Assigned Staff Team (1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Users size={16} className="text-orange-600" />
              <span>Assigned Supervising Staff Team</span>
            </h3>

            <p className="text-xs text-slate-500 mb-3">
              Management has assigned the following field supervisors to oversee your station duties:
            </p>

            <div className="space-y-3">
              {assignedStaffMembers.map(st => (
                <div key={st.id} className="p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200/80 transition flex items-center gap-3">
                  <img src={st.photo} alt={st.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{st.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {st.staffId} · Field Staff</p>
                    <button
                      onClick={() => setCallingContact({
                        name: st.name,
                        role: 'Field Supervising Staff',
                        mobile: st.mobile,
                        photo: st.photo,
                        bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'
                      })}
                      className="text-xs text-orange-600 font-bold mt-1 inline-flex items-center gap-1 hover:underline"
                    >
                      📞 Call {st.mobile}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              ⚡ Contact your assigned staff supervisor for station shifts, relief handovers, or emergency leaves.
            </div>
          </div>
        </div>

        {/* Right Column: Job Responsibilities & Salary (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Responsibilities */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-orange-600" />
              <span>Station Job Responsibilities & Safety Standards</span>
            </h2>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Fuel Dispensing & Safety Protocol', desc: 'Maintain clean uniform, safety footwear, and strictly enforce no-smoking rules on fuel nozzles.' },
                { title: 'Cash & POS Reconciliation', desc: 'Collect cash and credit card payments accurately and deposit reconciliation slips with the bunk cashier at shift end.' },
                { title: 'Shift Handover & Meter Log', desc: 'Ensure smooth meter reading handover to the next incoming shift attendant.' },
                { title: 'Emergency Management Escalation', desc: `In case of dispenser issues or fuel stock shortages, notify Manager ${assignedManager.name} immediately (📞 ${assignedManager.mobile}).` },
              ].map((item, i) => (
                <div key={i} className="p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-100 transition flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Breakdown & KYC Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <IndianRupee size={16} className="text-green-600" />
                <span>Salary Structure</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Basic Pay</span>
                  <span className="font-semibold text-slate-700">₹{((user?.salary || 18500) - 2500).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Shift Allowance</span>
                  <span className="font-semibold text-green-600">+₹2,500</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Payment Mode</span>
                  <span className="font-semibold text-blue-600">GPay / Bank Transfer</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-slate-800 text-sm">
                  <span>Net Monthly Salary</span>
                  <span className="text-green-700">₹{(user?.salary || 18500).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <User size={16} className="text-orange-600" />
                <span>Candidate Profile & KYC</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Candidate ID</span>
                  <span className="font-mono font-bold text-slate-700">{user?.clientId?.toUpperCase() || 'C001'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Registered Mobile</span>
                  <span className="font-mono font-bold text-slate-700">{user?.mobile}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Aadhaar KYC</span>
                  <span className="font-mono text-slate-700">{user?.aadhaar || 'XXXX-XXXX-4512'}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Joining Date</span>
                  <span className="font-semibold text-slate-700">{user?.joinDate || '2023-01-15'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Phone Call Modal ── */}
      <PhoneCallModal
        isOpen={!!callingContact}
        onClose={() => setCallingContact(null)}
        contact={callingContact}
      />
    </DashboardLayout>
  );
}
