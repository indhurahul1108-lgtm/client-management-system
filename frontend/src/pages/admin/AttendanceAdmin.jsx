import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE, DUMMY_USERS } from '../../data/dummyData.jsx';
import { calcLateMinutes, formatLate, SHIFT_CONFIG } from '../../utils/attendanceUtils.js';
import { Users, Clock, X, AlertTriangle, Settings, UserCheck, Building2, Eye, Printer, FileText } from 'lucide-react';
import { printIndividualRecord, printBulkRecords } from '../../utils/printUtils.js';

const STATUS_FILTERS = ['all', 'present', 'late', 'absent'];

function Badge({ status }) {
  const map = {
    present: 'bg-green-100 text-green-700',
    absent:  'bg-red-100 text-red-700',
    late:    'bg-yellow-100 text-yellow-700',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

function LateBadge({ punchIn, lateMinutes, shiftStart, graceMins }) {
  const late = lateMinutes !== undefined ? lateMinutes : calcLateMinutes(punchIn, shiftStart, graceMins);
  if (late === null) return <span className="text-slate-300 text-xs">—</span>;
  if (late <= 0)     return <span className="text-green-600 text-xs font-semibold">✓ On Time</span>;
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
      <AlertTriangle size={10} /> {formatLate(late)}
    </span>
  );
}

// Generate realistic role-separated attendance records
const today = new Date().toISOString().split('T')[0];

const INITIAL_ATTENDANCE = [
  // ── 1. MANAGERS ATTENDANCE ──
  { id: 'att_m1', userId: 'u002', staffName: 'Priya Nair', role: 'manager', date: today, punchIn: '09:45', punchOut: '18:15', status: 'present', location: 'Chennai HQ - Petrol Bunk Area', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { id: 'att_m2', userId: 'u003', staffName: 'Karthik Raja', role: 'manager', date: today, punchIn: '09:50', punchOut: '18:30', status: 'present', location: 'Chennai HQ - Bunk Field Office', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' },

  // ── 2. STAFF ATTENDANCE ──
  { id: 'att_s1', userId: 'u004', staffName: 'Anitha Devi', role: 'staff', date: today, punchIn: '10:05', punchOut: '19:10', status: 'present', location: 'IOCL Anna Salai Station', photo: 'https://ui-avatars.com/api/?name=Anitha+Devi&background=16a34a&color=fff' },
  { id: 'att_s2', userId: 'u005', staffName: 'Murugan P', role: 'staff', date: today, punchIn: '10:25', punchOut: '19:15', status: 'late', location: 'BPCL Guindy Station', photo: 'https://ui-avatars.com/api/?name=Murugan+P&background=d97706&color=fff' },
  { id: 'att_s3', userId: 'u006', staffName: 'Deepa S', role: 'staff', date: today, punchIn: '10:00', punchOut: '19:00', status: 'present', location: 'HPCL OMR Station', photo: 'https://ui-avatars.com/api/?name=Deepa+S&background=0891b2&color=fff' },
  { id: 'att_s4', userId: 'u007', staffName: 'Ravi Kumar', role: 'staff', date: today, punchIn: null, punchOut: null, status: 'absent', location: null, photo: null },
  { id: 'att_s5', userId: 'u008', staffName: 'Lavanya M', role: 'staff', date: today, punchIn: '09:55', punchOut: '18:58', status: 'present', location: 'Shell Sholinganallur', photo: 'https://ui-avatars.com/api/?name=Lavanya+M&background=c026d3&color=fff' },
  { id: 'att_s6', userId: 'u011', staffName: 'Vijay S', role: 'staff', date: today, punchIn: '10:35', punchOut: null, status: 'late', location: 'Nayara Poonamallee', photo: 'https://ui-avatars.com/api/?name=Vijay+S&background=9333ea&color=fff' },

  // ── 3. CLIENTS / DEPLOYED CANDIDATES ATTENDANCE ──
  { id: 'att_c1', userId: 'u014', staffName: 'Karthik Velu', role: 'client', date: today, punchIn: '05:55', punchOut: '14:02', status: 'present', location: 'Indian Oil Petrol Bunk — Anna Salai (GPS: 13.0827, 80.2707)', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  { id: 'att_c2', userId: 'u015', staffName: 'Saravanan M', role: 'client', date: today, punchIn: '13:58', punchOut: '22:05', status: 'present', location: 'BPCL Pump — Guindy Estate (GPS: 13.0067, 80.2025)', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' },
  { id: 'att_c3', userId: 'u016', staffName: 'Prakash R', role: 'client', date: today, punchIn: '21:55', punchOut: '06:05', status: 'present', location: 'HPCL 24/7 Station — OMR (GPS: 12.9716, 80.2458)', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'att_c4', userId: 'u017', staffName: 'Dinesh Kumar', role: 'client', date: today, punchIn: '06:15', punchOut: '14:00', status: 'late', location: 'Shell Petrol Station — Sholinganallur', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'att_c5', userId: 'u018', staffName: 'Suresh Babu', role: 'client', date: today, punchIn: null, punchOut: null, status: 'absent', location: null, photo: null },
  { id: 'att_c6', userId: 'u019', staffName: 'Manikandan V', role: 'client', date: today, punchIn: '05:58', punchOut: '14:00', status: 'present', location: 'IOCL Auto Care — Koyambedu', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { id: 'att_c7', userId: 'u020', staffName: 'Vigneshwaran S', role: 'client', date: today, punchIn: '14:02', punchOut: '22:00', status: 'present', location: 'BPCL Super Station — Tambaram', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
];

export default function AttendanceAdmin() {
  const [roleTab, setRoleTab] = useState('all'); // 'all' | 'manager' | 'staff' | 'client'
  const [filter, setFilter] = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [shiftStart, setShiftStart] = useState(SHIFT_CONFIG.shiftStart);
  const [graceMins, setGraceMins] = useState(SHIFT_CONFIG.graceMins);
  const [showSettings, setShowSettings] = useState(false);
  const [historyModal, setHistoryModal] = useState(null);

  const getPerson3MonthAttendance = (person) => {
    const bunk = person.location || (person.role === 'client' ? 'IOCL Petrol Bunk, Anna Salai' : 'Chennai Area');
    return [
      // October 2026
      { date: '2026-10-10', punchIn: person.punchIn || '06:00 AM', punchOut: person.punchOut || '02:00 PM', location: bunk, status: person.status || 'present' },
      { date: '2026-10-09', punchIn: '05:58 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-10-08', punchIn: '06:12 AM', punchOut: '02:00 PM', location: bunk, status: 'late', lateMinutes: 12 },
      { date: '2026-10-07', punchIn: '06:00 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-10-06', punchIn: '05:55 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      // September 2026
      { date: '2026-09-30', punchIn: '05:55 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-09-29', punchIn: '06:00 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-09-28', punchIn: '06:15 AM', punchOut: '02:00 PM', location: bunk, status: 'late', lateMinutes: 15 },
      { date: '2026-09-27', punchIn: '05:58 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-09-26', punchIn: '05:52 AM', punchOut: '02:05 PM', location: bunk, status: 'present' },
      // August 2026
      { date: '2026-08-31', punchIn: '05:58 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-08-30', punchIn: '06:00 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-08-29', punchIn: '05:55 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-08-28', punchIn: '06:05 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
      { date: '2026-08-27', punchIn: '05:57 AM', punchOut: '02:00 PM', location: bunk, status: 'present' },
    ];
  };

  const handlePrintIndividual = (record) => {
    const userObj = DUMMY_USERS.find(u => u.name === record.staffName || u.id === record.userId) || {};
    printIndividualRecord({
      title: `${record.staffName} — 3-Month Attendance Statement`,
      person: {
        name: record.staffName,
        staffId: userObj.staffId || userObj.clientId || userObj.managerId || record.userId,
        mobile: userObj.mobile || '9876543210',
        role: record.role === 'manager' ? 'Manager' : record.role === 'staff' ? 'Staff' : 'Candidate (Client)',
        roleAtBunk: userObj.roleAtBunk || (record.role === 'client' ? 'Fuel Dispenser Attendant' : record.role.toUpperCase()),
        assignedBunk: userObj.assignedBunk || record.location || 'IOCL Petrol Bunk',
        shift: userObj.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'attendance',
      records: getPerson3MonthAttendance(record),
    });
  };

  const attendanceWithLate = INITIAL_ATTENDANCE.map(a => ({
    ...a,
    computedLate: calcLateMinutes(a.punchIn, shiftStart, graceMins),
  }));

  const filtered = attendanceWithLate.filter(a => {
    const matchRole = roleTab === 'all' || a.role === roleTab;
    const matchStatus = filter === 'all' || a.status === filter;
    return matchRole && matchStatus;
  });

  const present = filtered.filter(a => a.status === 'present').length;
  const absent  = filtered.filter(a => a.status === 'absent').length;
  const late    = filtered.filter(a => a.status === 'late').length;

  const handlePrintTotal = () => {
    printBulkRecords({
      title: `Official Attendance Register — ${roleTab.toUpperCase()} (${filter.toUpperCase()})`,
      subtitle: `Date: ${today} | Shift Start: ${shiftStart} | Grace Period: ${graceMins} mins`,
      summaryCards: [
        { label: 'Total Records', value: filtered.length },
        { label: 'Present', value: present },
        { label: 'Late', value: late },
        { label: 'Absent', value: absent },
      ],
      columns: [
        { header: 'Person Name', key: 'staffName' },
        { header: 'Role / Category', render: r => r.role === 'manager' ? 'Manager' : r.role === 'staff' ? 'Staff' : 'Candidate (Client)' },
        { header: 'Date', key: 'date' },
        { header: 'Punch In', render: r => r.punchIn || '—' },
        { header: 'Late Status', render: r => r.computedLate > 0 ? `+${r.computedLate} mins late` : 'On Time' },
        { header: 'Punch Out', render: r => r.punchOut || '—' },
        { header: 'Location & Station', render: r => r.location || '—' },
        { header: 'Status', render: r => r.status.toUpperCase(), style: 'font-weight:bold;' },
      ],
      rows: filtered,
    });
  };

  return (
    <DashboardLayout title="Attendance Management">

      {/* ── Separate Role Selection Tabs (Manager, Staff, Clients) ── */}
      <div className="bg-white rounded-2xl p-2 mb-5 border border-slate-200/80 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'all',     label: 'All Attendance', icon: Users, color: 'bg-slate-900 text-white' },
          { id: 'manager', label: 'Managers Attendance', icon: UserCheck, color: 'bg-purple-700 text-white' },
          { id: 'staff',   label: 'Staff Attendance', icon: Users, color: 'bg-green-700 text-white' },
          { id: 'client',  label: 'Clients / Bunk Candidates', icon: Building2, color: 'bg-orange-600 text-white' },
        ].map(tab => {
          const Icon = tab.icon;
          const active = roleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRoleTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                active ? tab.color : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {attendanceWithLate.filter(a => tab.id === 'all' || a.role === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0"><Users size={18} className="text-white" /></div>
          <div><p className="text-xl font-bold text-blue-800">{filtered.length}</p><p className="text-xs text-blue-600 font-medium">Selected Total</p></div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0"><Users size={18} className="text-white" /></div>
          <div><p className="text-xl font-bold text-green-800">{present}</p><p className="text-xs text-green-600 font-medium">Present</p></div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0"><Users size={18} className="text-white" /></div>
          <div><p className="text-xl font-bold text-red-800">{absent}</p><p className="text-xs text-red-600 font-medium">Absent</p></div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0"><Clock size={18} className="text-white" /></div>
          <div><p className="text-xl font-bold text-yellow-800">{late}</p><p className="text-xs text-yellow-600 font-medium">Late</p></div>
        </div>
      </div>

      {/* Shift Banner */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-blue-800">
          <Clock size={15} />
          <span>Standard Shift: <strong>{shiftStart}</strong> &nbsp;|&nbsp; Grace: <strong>{graceMins} mins</strong> &nbsp;|&nbsp; GPS Camera Verified</span>
        </div>
        <button onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium">
          <Settings size={12} /> Shift Config
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Status Filters & Total Print Button */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                  ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f === 'all' ? `All (${filtered.length})` : `${f}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-600 font-medium hidden sm:inline">🔒 Selfie & GPS Camera Logs</span>
            <button
              onClick={handlePrintTotal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Printer size={14} />
              <span>Print All (Total Print)</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Person / Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Late Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location & GPS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Selfie Photo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className={`hover:bg-slate-50 transition ${a.status === 'absent' ? 'bg-red-50/20' : a.status === 'late' ? 'bg-yellow-50/20' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        a.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                        a.role === 'staff' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {a.staffName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{a.staffName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      a.role === 'manager' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      a.role === 'staff' ? 'bg-green-50 text-green-700 border border-green-200' :
                      'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {a.role === 'manager' ? 'Manager' : a.role === 'staff' ? 'Staff' : 'Candidate (Client)'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs font-mono">{a.date}</td>
                  <td className="px-4 py-3.5">
                    {a.punchIn
                      ? <span className="flex items-center gap-1 text-slate-800 font-mono font-bold text-xs"><Clock size={11} className="text-slate-400" />{a.punchIn}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <LateBadge punchIn={a.punchIn} lateMinutes={a.computedLate} shiftStart={shiftStart} graceMins={graceMins} />
                  </td>
                  <td className="px-4 py-3.5">
                    {a.punchOut
                      ? <span className="text-slate-700 font-mono text-xs">{a.punchOut}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs max-w-[200px] truncate" title={a.location}>
                    {a.location || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {a.photo ? (
                      <button onClick={() => setPreviewPhoto({ photo: a.photo, name: a.staffName, date: a.date, late: a.computedLate, loc: a.location })}
                        className="relative group">
                        <img src={a.photo} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100 group-hover:border-blue-400 transition" />
                      </button>
                    ) : <span className="text-slate-300 text-xs">No photo</span>}
                  </td>
                  <td className="px-4 py-3.5"><Badge status={a.status} /></td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setHistoryModal({ person: a, records: getPerson3MonthAttendance(a) })}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                        title="View 3-Month Attendance"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handlePrintIndividual(a)}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                        title="Print 3-Month Statement"
                      >
                        <Printer size={13} />
                        <span>Print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No records found for this category</div>}
      </div>

      {/* ── Shift Settings Modal ── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-blue-600" /> Shift Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Shift Start Time</label>
                <input type="time" value={shiftStart} onChange={e => setShiftStart(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base font-bold text-blue-700 bg-blue-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Grace Period (minutes)</label>
                <input type="number" value={graceMins} onChange={e => setGraceMins(Number(e.target.value))} min={0} max={60}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base font-bold text-yellow-700 bg-yellow-50" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Month Individual History Modal */}
      {historyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Printer size={18} className="text-amber-400" />
                  <span>3-Month Verified Attendance Statement</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {historyModal.person.staffName} &nbsp;|&nbsp; Category: {historyModal.person.role.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintIndividual(historyModal.person)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl shadow transition"
                >
                  <Printer size={14} />
                  <span>Print Statement</span>
                </button>
                <button
                  onClick={() => setHistoryModal(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Recorded Shifts</p>
                  <p className="text-lg font-black text-slate-800">{historyModal.records.length} Duty Days</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    ✓ {historyModal.records.filter(r => r.status === 'present').length} Present
                  </span>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                    ⚠️ {historyModal.records.filter(r => r.status === 'late').length} Late
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Punch In</th>
                      <th className="p-3 text-left">Punch Out</th>
                      <th className="p-3 text-left">Station / Location</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyModal.records.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-700">{r.date}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{r.punchIn}</td>
                        <td className="p-3 font-mono text-slate-600">{r.punchOut}</td>
                        <td className="p-3 text-slate-700">{r.location}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {r.status} {r.lateMinutes ? `(+${r.lateMinutes}m)` : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
          <div className="relative w-full max-w-sm bg-slate-900 rounded-3xl p-5" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewPhoto(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={20} /></button>
            <img src={previewPhoto.photo} alt="" className="w-full h-64 object-cover rounded-2xl shadow-2xl" />
            <div className="mt-4 text-center text-white">
              <p className="font-bold text-base">{previewPhoto.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{previewPhoto.date}</p>
              <p className="text-emerald-400 text-xs mt-1 font-mono">{previewPhoto.loc || 'Bunk Station'}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
