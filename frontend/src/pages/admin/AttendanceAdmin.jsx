import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { CalendarCheck, Users, Clock } from 'lucide-react';

const STATUS_FILTERS = ['all', 'present', 'absent', 'late'];

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function AttendanceAdmin() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? DUMMY_ATTENDANCE : DUMMY_ATTENDANCE.filter(a => a.status === filter);

  const present = DUMMY_ATTENDANCE.filter(a => a.status === 'present').length;
  const absent  = DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length;
  const late    = DUMMY_ATTENDANCE.filter(a => a.status === 'late').length;

  return (
    <DashboardLayout title="Attendance">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Staff',    value: DUMMY_ATTENDANCE.length, color: 'bg-blue-50 border-blue-100',   icon: 'bg-blue-600',   text: 'text-blue-800' },
          { label: 'Present',        value: present,                 color: 'bg-green-50 border-green-100', icon: 'bg-green-600',  text: 'text-green-800' },
          { label: 'Absent',         value: absent,                  color: 'bg-red-50 border-red-100',     icon: 'bg-red-500',    text: 'text-red-800' },
          { label: 'Late',           value: late,                    color: 'bg-yellow-50 border-yellow-100', icon: 'bg-yellow-500', text: 'text-yellow-800' },
        ].map(({ label, value, color, icon, text }) => (
          <div key={label} className={`${color} border rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 ${icon} rounded-xl flex items-center justify-center`}>
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter tabs */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition
                ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Photo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">{a.staffName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{a.date}</td>
                  <td className="px-4 py-4">
                    {a.punchIn ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium"><Clock size={13} />{a.punchIn}</span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    {a.punchOut ? (
                      <span className="flex items-center gap-1 text-blue-600 font-medium"><Clock size={13} />{a.punchOut}</span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">{a.location || '—'}</td>
                  <td className="px-4 py-4">
                    {a.photo ? (
                      <img src={a.photo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-4"><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
