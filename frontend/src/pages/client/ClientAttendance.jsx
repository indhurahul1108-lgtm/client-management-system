import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { printIndividualRecord } from '../../utils/printUtils.js';
import { CalendarCheck, ShieldCheck, Printer, CheckCircle, Clock, MapPin, User, Users } from 'lucide-react';

const ATTENDANCE_HISTORY = [
  // October 2026
  { date: '2026-10-10', punchIn: '05:55 AM', punchOut: '02:05 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-10-09', punchIn: '05:58 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-10-08', punchIn: '06:12 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'late', lateMinutes: 12 },
  { date: '2026-10-07', punchIn: '06:00 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-10-06', punchIn: '05:56 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  // September 2026
  { date: '2026-09-30', punchIn: '05:55 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-09-29', punchIn: '06:00 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-09-28', punchIn: '06:15 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'late', lateMinutes: 15 },
  { date: '2026-09-27', punchIn: '05:58 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-09-26', punchIn: '05:52 AM', punchOut: '02:05 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  // August 2026
  { date: '2026-08-31', punchIn: '05:58 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-08-30', punchIn: '06:00 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-08-29', punchIn: '05:55 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-08-28', punchIn: '06:05 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
  { date: '2026-08-27', punchIn: '05:57 AM', punchOut: '02:00 PM', location: 'IOCL Petrol Bunk, Anna Salai', status: 'present' },
];

export default function ClientAttendance() {
  const { user } = useAuth();

  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId) || { name: 'Anitha Devi', mobile: '9000000004' };

  const handlePrint = () => {
    printIndividualRecord({
      title: 'Candidate / Worker 3-Month Attendance Statement',
      person: {
        name: user?.name || 'Karthik Velu',
        staffId: user?.clientId || 'C001',
        mobile: user?.mobile || '9876543210',
        role: 'Client Candidate',
        roleAtBunk: user?.roleAtBunk || 'Fuel Dispenser Attendant',
        assignedBunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)',
        shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'attendance',
      records: ATTENDANCE_HISTORY,
    });
  };

  const presentCount = ATTENDANCE_HISTORY.filter(a => a.status === 'present').length;
  const lateCount = ATTENDANCE_HISTORY.filter(a => a.status === 'late').length;

  return (
    <DashboardLayout title="My Attendance">
      {/* ── Top Info Banner ── */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 text-white mb-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl shrink-0 backdrop-blur-sm">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Verified Attendance Statement
            </h2>
            <p className="text-xs text-orange-100 mt-1 max-w-xl leading-relaxed">
              Clients do not punch manually. Your daily duty attendance is directly verified and certified by your assigned field staff at the petrol bunk station.
            </p>
            <p className="text-xs text-amber-200 mt-2 font-semibold flex items-center gap-1.5">
              <User size={13} /> Supervising Staff Incharge: {assignedStaff.name} (📞 {assignedStaff.mobile})
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow transition shrink-0"
        >
          <Printer size={16} /> Print My Statement
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-black text-slate-800">{ATTENDANCE_HISTORY.length}</p>
          <p className="text-xs text-slate-500 font-medium">Total Shift Days</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-black text-emerald-700">{presentCount}</p>
          <p className="text-xs text-emerald-600 font-medium">Present Days (Approved)</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-black text-amber-700">{lateCount}</p>
          <p className="text-xs text-amber-600 font-medium">Late Days</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-black text-blue-700">100%</p>
          <p className="text-xs text-blue-600 font-medium">Attendance Rate</p>
        </div>
      </div>

      {/* ── 3-Month Attendance Table ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <CalendarCheck size={18} className="text-orange-600" />
              <span>3-Month Attendance Records</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.assignedBunk || 'Indian Oil Petrol Bunk'} &nbsp;·&nbsp; {user?.shift || 'Shift 1: Morning'}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl text-xs font-bold transition"
          >
            <Printer size={13} /> Print
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Duty Station / Bunk</th>
                <th className="px-5 py-3 text-left">Duty Start (In)</th>
                <th className="px-5 py-3 text-left">Duty End (Out)</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ATTENDANCE_HISTORY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono font-medium text-slate-700">{row.date}</td>
                  <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5">
                    <MapPin size={13} className="text-orange-500 shrink-0" />
                    <span className="truncate">{row.location}</span>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-slate-800">{row.punchIn}</td>
                  <td className="px-5 py-3 font-mono text-slate-500">{row.punchOut}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      row.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.status} {row.lateMinutes ? `(+${row.lateMinutes}m)` : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
