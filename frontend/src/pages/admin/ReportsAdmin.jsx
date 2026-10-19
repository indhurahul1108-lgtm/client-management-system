import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES, DUMMY_USERS } from '../../data/dummyData.jsx';
import { BarChart2, CalendarCheck, FileText, DollarSign, Printer, Download, Users, UserCheck, Building2 } from 'lucide-react';

const TABS = [
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'leave',      label: 'Leave',      icon: FileText },
  { id: 'salary',     label: 'Salary',     icon: DollarSign },
];

function SummaryCard({ label, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-5 text-center border`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function ReportsAdmin() {
  const [tab, setTab] = useState('attendance');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'manager' | 'staff' | 'client'

  const usersWithRole = DUMMY_USERS;

  // Enhance attendance records with roles
  const attendanceData = DUMMY_ATTENDANCE.map(a => {
    const u = usersWithRole.find(user => user.id === a.userId || user.name === a.staffName);
    return {
      ...a,
      role: u?.role || (a.userId?.startsWith('u002') || a.userId?.startsWith('u003') ? 'manager' : 'staff'),
      category: u?.role === 'manager' ? 'Manager' : u?.role === 'client' ? 'Client Candidate' : 'Staff',
    };
  });

  const clientAttendanceSamples = [
    { id: 'catt_1', staffName: 'Karthik Velu', role: 'client', category: 'Client Candidate', date: '2026-10-10', punchIn: '05:55 AM', punchOut: '02:05 PM', status: 'present', location: 'IOCL Anna Salai' },
    { id: 'catt_2', staffName: 'Saravanan M', role: 'client', category: 'Client Candidate', date: '2026-10-10', punchIn: '01:58 PM', punchOut: '10:02 PM', status: 'present', location: 'BPCL Guindy' },
    { id: 'catt_3', staffName: 'Prakash R', role: 'client', category: 'Client Candidate', date: '2026-10-09', punchIn: '10:00 PM', punchOut: '06:05 AM', status: 'present', location: 'HPCL OMR' },
    { id: 'catt_4', staffName: 'Dinesh Kumar', role: 'client', category: 'Client Candidate', date: '2026-10-09', punchIn: '06:12 AM', punchOut: '02:00 PM', status: 'late', location: 'Shell Sholinganallur' },
  ];

  const managerAttendanceSamples = [
    { id: 'matt_1', staffName: 'Priya Nair', role: 'manager', category: 'Manager', date: '2026-10-10', punchIn: '09:45 AM', punchOut: '06:15 PM', status: 'present', location: 'Chennai HQ' },
    { id: 'matt_2', staffName: 'Karthik Raja', role: 'manager', category: 'Manager', date: '2026-10-10', punchIn: '09:50 AM', punchOut: '06:30 PM', status: 'present', location: 'Chennai HQ' },
  ];

  const fullAttendance = [...managerAttendanceSamples, ...attendanceData, ...clientAttendanceSamples];
  const filteredAttendance = fullAttendance.filter(a => roleFilter === 'all' || a.role === roleFilter);

  // Enhance leaves with roles
  const leavesData = DUMMY_LEAVES.map(l => {
    const u = usersWithRole.find(user => user.id === l.staffId || user.name === l.staffName);
    return {
      ...l,
      role: u?.role || 'staff',
      category: u?.role === 'manager' ? 'Manager' : u?.role === 'client' ? 'Client Candidate' : 'Staff',
    };
  });

  const clientLeaveSamples = [
    { id: 'cleave_1', staffName: 'Karthik Velu', role: 'client', category: 'Client Candidate', leaveType: 'Casual Leave', fromDate: '2026-10-12', toDate: '2026-10-13', status: 'pending' },
    { id: 'cleave_2', staffName: 'Saravanan M', role: 'client', category: 'Client Candidate', leaveType: 'Sick Leave', fromDate: '2026-10-14', toDate: '2026-10-14', status: 'approved' },
  ];

  const managerLeaveSamples = [
    { id: 'mleave_1', staffName: 'Priya Nair', role: 'manager', category: 'Manager', leaveType: 'Casual Leave', fromDate: '2026-10-18', toDate: '2026-10-19', status: 'pending' },
    { id: 'mleave_2', staffName: 'Karthik Raja', role: 'manager', category: 'Manager', leaveType: 'Annual Leave', fromDate: '2026-10-25', toDate: '2026-10-28', status: 'approved' },
  ];

  const fullLeaves = [...managerLeaveSamples, ...leavesData, ...clientLeaveSamples];
  const filteredLeaves = fullLeaves.filter(l => roleFilter === 'all' || l.role === roleFilter);

  // Enhance salaries with roles
  const salaryData = DUMMY_SALARIES.map(s => {
    const u = usersWithRole.find(user => user.id === s.staffId || user.name === s.staffName);
    return {
      ...s,
      role: u?.role || 'staff',
      category: u?.role === 'manager' ? 'Manager' : u?.role === 'client' ? 'Client Candidate' : 'Staff',
    };
  });

  const clientSalarySamples = [
    { id: 'csal_1', staffName: 'Karthik Velu', role: 'client', category: 'Client Candidate', month: 'October 2026', net: 18500, status: 'pending' },
    { id: 'csal_2', staffName: 'Saravanan M', role: 'client', category: 'Client Candidate', month: 'October 2026', net: 19000, status: 'paid' },
    { id: 'csal_3', staffName: 'Prakash R', role: 'client', category: 'Client Candidate', month: 'October 2026', net: 19500, status: 'paid' },
    { id: 'csal_4', staffName: 'Dinesh Kumar', role: 'client', category: 'Client Candidate', month: 'October 2026', net: 18000, status: 'pending' },
  ];

  const managerSalarySamples = [
    { id: 'msal_1', staffName: 'Priya Nair', role: 'manager', category: 'Manager', month: 'October 2026', net: 45000, status: 'paid' },
    { id: 'msal_2', staffName: 'Karthik Raja', role: 'manager', category: 'Manager', month: 'October 2026', net: 42000, status: 'paid' },
  ];

  const fullSalaries = [...managerSalarySamples, ...salaryData, ...clientSalarySamples];
  const filteredSalaries = fullSalaries.filter(s => roleFilter === 'all' || s.role === roleFilter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Official Reports">

      {/* ── Tabs & Role Filter Controls (Hidden on Print) ── */}
      <div className="no-print space-y-4 mb-6">

        {/* Tab selection */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  tab === id ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
          >
            <Printer size={16} /> Print Official Report
          </button>
        </div>

        {/* Role Separation Filter (Managers, Staff, Clients) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase mr-2">
            Filter by Role:
          </span>
          {[
            { id: 'all',     label: 'All Roles', icon: Users },
            { id: 'manager', label: 'Managers Only', icon: UserCheck },
            { id: 'staff',   label: 'Staff Only', icon: Users },
            { id: 'client',  label: 'Clients / Candidates Only', icon: Building2 },
          ].map(rf => {
            const Icon = rf.icon;
            const active = roleFilter === rf.id;
            return (
              <button
                key={rf.id}
                onClick={() => setRoleFilter(rf.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  active ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={13} /> {rf.label}
              </button>
            );
          })}
        </div>

      </div>

      <div id="report-content">

        {/* ── 1. Attendance Report ── */}
        {tab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
              <SummaryCard label="Total Records" value={filteredAttendance.length} color="bg-blue-50 border-blue-100 text-blue-800" />
              <SummaryCard label="Present" value={filteredAttendance.filter(a => a.status === 'present').length} color="bg-green-50 border-green-100 text-green-800" />
              <SummaryCard label="Absent" value={filteredAttendance.filter(a => a.status === 'absent').length} color="bg-red-50 border-red-100 text-red-800" />
              <SummaryCard label="Late" value={filteredAttendance.filter(a => a.status === 'late').length} color="bg-yellow-50 border-yellow-100 text-yellow-800" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  Daily Attendance Report — ({roleFilter.toUpperCase()})
                </h3>
                <span className="text-xs text-slate-500 font-mono">Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Person Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role / Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendance.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-semibold text-slate-800 text-xs">{a.staffName}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-600">{a.category}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{a.date}</td>
                        <td className="px-4 py-3 text-slate-700 text-xs font-mono">{a.punchIn || '—'}</td>
                        <td className="px-4 py-3 text-slate-700 text-xs font-mono">{a.punchOut || '—'}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{a.location || 'Chennai Area'}</td>
                        <td className="px-4 py-3"><Badge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. Leave Report ── */}
        {tab === 'leave' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 no-print">
              <SummaryCard label="Pending"  value={filteredLeaves.filter(l => l.status === 'pending').length}  color="bg-yellow-50 border-yellow-100 text-yellow-800" />
              <SummaryCard label="Approved" value={filteredLeaves.filter(l => l.status === 'approved').length} color="bg-green-50 border-green-100 text-green-800" />
              <SummaryCard label="Rejected" value={filteredLeaves.filter(l => l.status === 'rejected').length} color="bg-red-50 border-red-100 text-red-800" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  Leave Report — ({roleFilter.toUpperCase()})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Person Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Leave Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">From Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">To Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-semibold text-slate-800 text-xs">{l.staffName}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-600">{l.category}</td>
                        <td className="px-4 py-3 text-slate-700 text-xs font-medium">{l.leaveType}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{l.fromDate}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{l.toDate}</td>
                        <td className="px-4 py-3"><Badge status={l.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Salary Report ── */}
        {tab === 'salary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
              <SummaryCard label="Total Records" value={filteredSalaries.length} color="bg-blue-50 border-blue-100 text-blue-800" />
              <SummaryCard label="Paid" value={filteredSalaries.filter(s => s.status === 'paid').length} color="bg-green-50 border-green-100 text-green-800" />
              <SummaryCard label="Pending" value={filteredSalaries.filter(s => s.status === 'pending').length} color="bg-yellow-50 border-yellow-100 text-yellow-800" />
              <SummaryCard label="Total Payable" value={`₹${filteredSalaries.reduce((a, s) => a + (s.net || 0), 0).toLocaleString('en-IN')}`} color="bg-purple-50 border-purple-100 text-purple-800" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  Monthly Salary Report — ({roleFilter.toUpperCase()})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Person Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net Salary</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSalaries.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-semibold text-slate-800 text-xs">{s.staffName}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-600">{s.category}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{s.month}</td>
                        <td className="px-4 py-3 text-right font-black font-mono text-slate-800 text-xs">
                          ₹{s.net?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3"><Badge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
