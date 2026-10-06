import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES, DUMMY_OVERDUE, DUMMY_USERS } from '../../data/dummyData.jsx';
import { BarChart2, CalendarCheck, FileText, DollarSign, AlertTriangle, Printer, Download } from 'lucide-react';

const TABS = [
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'leave',      label: 'Leave',      icon: FileText },
  { id: 'salary',     label: 'Salary',     icon: DollarSign },
  { id: 'overdue',    label: 'Overdue',    icon: AlertTriangle },
];

function SummaryCard({ label, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-5 text-center border`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
    </div>
  );
}

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700', pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700', completed: 'bg-blue-100 text-blue-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

const TAB_LABELS = { attendance: 'Attendance Report', leave: 'Leave Report', salary: 'Salary Report', overdue: 'Overdue Report' };

export default function ReportsAdmin() {
  const [tab, setTab] = useState('attendance');

  const handlePrint = () => {
    const title  = TAB_LABELS[tab];
    const date   = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const content = document.getElementById('report-content');
    if (!content) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; font-size: 12px; }
            body { padding: 24px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1d4ed8; padding-bottom: 12px; margin-bottom: 20px; }
            .company { font-size: 18px; font-weight: bold; color: #1d4ed8; }
            .report-title { font-size: 14px; font-weight: bold; margin-top: 4px; }
            .date { font-size: 11px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { background: #1d4ed8; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) td { background: #f8fafc; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: bold; }
            .green { background: #dcfce7; color: #166534; }
            .red   { background: #fee2e2; color: #991b1b; }
            .yellow{ background: #fef9c3; color: #854d0e; }
            .blue  { background: #dbeafe; color: #1e40af; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
            .stats { display: flex; gap: 16px; margin-bottom: 16px; }
            .stat-box { flex: 1; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; text-align: center; }
            .stat-val { font-size: 20px; font-weight: bold; color: #1d4ed8; }
            .stat-lbl { font-size: 10px; color: #64748b; margin-top: 2px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">Client Management System</div>
              <div class="report-title">${title}</div>
              <div class="date">Generated: ${date}</div>
            </div>
            <div style="text-align:right; color:#64748b; font-size:11px;">
              <div>Printed by: Admin</div>
              <div>${new Date().toLocaleTimeString('en-IN')}</div>
            </div>
          </div>
          ${content.innerHTML}
          <div class="footer">This is a system-generated report. Client Management System © ${new Date().getFullYear()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  return (
    <DashboardLayout title="Reports">
      {/* Tab navigation + Print Button */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition
              ${tab === id ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
        <button onClick={handlePrint}
          className="ml-auto flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
          <Printer size={15} /> Print / PDF
        </button>
      </div>

      <div id="report-content">
      {/* Attendance Report */}
      {tab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Total Records"  value={DUMMY_ATTENDANCE.length}                               color="bg-blue-50 border-blue-100 text-blue-800" />
            <SummaryCard label="Present"        value={DUMMY_ATTENDANCE.filter(a => a.status === 'present').length} color="bg-green-50 border-green-100 text-green-800" />
            <SummaryCard label="Absent"         value={DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length}  color="bg-red-50 border-red-100 text-red-800" />
            <SummaryCard label="Late"           value={DUMMY_ATTENDANCE.filter(a => a.status === 'late').length}    color="bg-yellow-50 border-yellow-100 text-yellow-800" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Daily Attendance Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {DUMMY_ATTENDANCE.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{a.staffName}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{a.date}</td>
                      <td className="px-4 py-3 text-slate-500">{a.punchIn || '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{a.punchOut || '—'}</td>
                      <td className="px-4 py-3"><Badge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave Report */}
      {tab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="Pending"  value={DUMMY_LEAVES.filter(l => l.status === 'pending').length}  color="bg-yellow-50 border-yellow-100 text-yellow-800" />
            <SummaryCard label="Approved" value={DUMMY_LEAVES.filter(l => l.status === 'approved').length} color="bg-green-50 border-green-100 text-green-800" />
            <SummaryCard label="Rejected" value={DUMMY_LEAVES.filter(l => l.status === 'rejected').length} color="bg-red-50 border-red-100 text-red-800" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Leave Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">From</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">To</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {DUMMY_LEAVES.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{l.staffName}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{l.leaveType}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{l.fromDate}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{l.toDate}</td>
                      <td className="px-4 py-3"><Badge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Salary Report */}
      {tab === 'salary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Total Records" value={DUMMY_SALARIES.length}                              color="bg-blue-50 border-blue-100 text-blue-800" />
            <SummaryCard label="Paid"          value={DUMMY_SALARIES.filter(s => s.status === 'paid').length}    color="bg-green-50 border-green-100 text-green-800" />
            <SummaryCard label="Pending"       value={DUMMY_SALARIES.filter(s => s.status === 'pending').length} color="bg-yellow-50 border-yellow-100 text-yellow-800" />
            <SummaryCard label="Total Payable" value={`₹${DUMMY_SALARIES.reduce((a, s) => a + s.net, 0).toLocaleString('en-IN')}`} color="bg-purple-50 border-purple-100 text-purple-800" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Salary Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net Salary</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {DUMMY_SALARIES.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{s.staffName}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{s.month}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">₹{s.net.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><Badge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Report */}
      {tab === 'overdue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="Overdue"   value={DUMMY_OVERDUE.filter(o => o.status === 'overdue').length}   color="bg-red-50 border-red-100 text-red-800" />
            <SummaryCard label="Pending"   value={DUMMY_OVERDUE.filter(o => o.status === 'pending').length}   color="bg-yellow-50 border-yellow-100 text-yellow-800" />
            <SummaryCard label="Completed" value={DUMMY_OVERDUE.filter(o => o.status === 'completed').length} color="bg-green-50 border-green-100 text-green-800" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Overdue Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Task</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Overdue Days</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {DUMMY_OVERDUE.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{o.clientName}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{o.task}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{o.dueDate}</td>
                      <td className="px-4 py-3 text-center">
                        {o.overdueDays > 0 ? (
                          <span className="text-red-600 font-bold">+{o.overdueDays}d</span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3"><Badge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>{/* end report-content */}
    </DashboardLayout>
  );
}
