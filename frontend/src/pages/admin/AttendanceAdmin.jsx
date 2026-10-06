import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { Users, Clock, X } from 'lucide-react';

const STATUS_FILTERS = ['all', 'present', 'absent', 'late'];

function Badge({ status }) {
  const map = {
    present: 'bg-green-100 text-green-700',
    absent:  'bg-red-100 text-red-700',
    late:    'bg-yellow-100 text-yellow-700',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function AttendanceAdmin() {
  const [filter,       setFilter]       = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null); // full-screen photo modal

  const filtered = filter === 'all'
    ? DUMMY_ATTENDANCE
    : DUMMY_ATTENDANCE.filter(a => a.status === filter);

  const present = DUMMY_ATTENDANCE.filter(a => a.status === 'present').length;
  const absent  = DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length;
  const late    = DUMMY_ATTENDANCE.filter(a => a.status === 'late').length;

  return (
    <DashboardLayout title="Attendance">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Records', value: DUMMY_ATTENDANCE.length, color: 'blue' },
          { label: 'Present',       value: present,                 color: 'green' },
          { label: 'Absent',        value: absent,                  color: 'red' },
          { label: 'Late',          value: late,                    color: 'yellow' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 bg-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Admin notice ── */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-blue-700 text-sm font-medium flex items-center gap-2">
        🔒 Attendance photos with location are visible to Admin only
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter tabs */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition
                ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f === 'all' ? `All (${DUMMY_ATTENDANCE.length})` : `${f} (${DUMMY_ATTENDANCE.filter(a => a.status === f).length})`}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">📸 Photo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">{a.staffName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{a.date}</td>
                  <td className="px-4 py-4">
                    {a.punchIn
                      ? <span className="flex items-center gap-1 text-green-600 font-medium"><Clock size={12} />{a.punchIn}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    {a.punchOut
                      ? <span className="flex items-center gap-1 text-blue-600 font-medium"><Clock size={12} />{a.punchOut}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs max-w-[150px] truncate">{a.location || '—'}</td>
                  <td className="px-4 py-4">
                    {a.photo ? (
                      <button onClick={() => setPreviewPhoto({ photo: a.photo, name: a.staffName, date: a.date })}
                        className="relative group">
                        <img src={a.photo} alt="" className="w-14 h-10 rounded-lg object-cover border-2 border-slate-100 group-hover:border-blue-400 transition" />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition flex items-center justify-center text-xs text-white font-bold opacity-0 group-hover:opacity-100">View</span>
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">No photo</span>
                    )}
                  </td>
                  <td className="px-4 py-4"><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No records found</div>
        )}
      </div>

      {/* ── Full-screen Photo Preview Modal (Admin only) ── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}>
          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewPhoto(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1 text-sm">
              <X size={16} /> Close
            </button>
            <img src={previewPhoto.photo} alt="attendance" className="w-full rounded-2xl shadow-2xl" />
            <div className="mt-3 text-center">
              <p className="text-white font-bold">{previewPhoto.name}</p>
              <p className="text-slate-400 text-sm">{previewPhoto.date}</p>
              <p className="text-blue-400 text-xs mt-1">🔒 Admin View — Location & Time embedded in photo</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
