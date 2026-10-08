import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { calcLateMinutes, formatLate, SHIFT_CONFIG } from '../../utils/attendanceUtils.js';
import { Users, Clock, X, AlertTriangle, Settings } from 'lucide-react';

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
  // Use precomputed lateMinutes OR calculate on the fly
  const late = lateMinutes !== undefined ? lateMinutes : calcLateMinutes(punchIn, shiftStart, graceMins);
  if (late === null) return <span className="text-slate-300 text-xs">—</span>;
  if (late <= 0)     return <span className="text-green-600 text-xs font-semibold">✓ On Time</span>;
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
      <AlertTriangle size={10} /> {formatLate(late)}
    </span>
  );
}

export default function AttendanceAdmin() {
  const [filter,       setFilter]       = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [shiftStart,   setShiftStart]   = useState(SHIFT_CONFIG.shiftStart);
  const [graceMins,    setGraceMins]    = useState(SHIFT_CONFIG.graceMins);
  const [showSettings, setShowSettings] = useState(false);

  // Recalculate late for all records using current shift config
  const attendanceWithLate = DUMMY_ATTENDANCE.map(a => ({
    ...a,
    computedLate: calcLateMinutes(a.punchIn, shiftStart, graceMins),
  }));

  const filtered = filter === 'all'
    ? attendanceWithLate
    : attendanceWithLate.filter(a => a.status === filter);

  const present = DUMMY_ATTENDANCE.filter(a => a.status === 'present').length;
  const absent  = DUMMY_ATTENDANCE.filter(a => a.status === 'absent').length;
  const late    = DUMMY_ATTENDANCE.filter(a => a.status === 'late').length;
  const totalLateMinutes = attendanceWithLate.reduce((sum, a) => sum + (a.computedLate > 0 ? a.computedLate : 0), 0);

  return (
    <DashboardLayout title="Attendance">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0"><Users size={18} className="text-white" /></div>
          <div><p className="text-xl font-bold text-blue-800">{DUMMY_ATTENDANCE.length}</p><p className="text-xs text-blue-600 font-medium">Total</p></div>
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
          <div><p className="text-xl font-bold text-yellow-800">{late}</p><p className="text-xs text-yellow-600 font-medium">Late ({totalLateMinutes} mins total)</p></div>
        </div>
      </div>

      {/* Shift config banner */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-sm text-blue-700">
          <Clock size={15} />
          <span>Shift: <strong>{shiftStart}</strong> &nbsp;|&nbsp; Grace period: <strong>{graceMins} mins</strong> &nbsp;|&nbsp; Late after: <strong>{(() => { const [h,m]=shiftStart.split(':').map(Number); const total=h*60+m+graceMins; return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`; })()} AM</strong></span>
        </div>
        <button onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium">
          <Settings size={12} /> Change Shift Time
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter + note */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f === 'all' ? `All (${DUMMY_ATTENDANCE.length})` : `${f} (${DUMMY_ATTENDANCE.filter(a => a.status === f).length})`}
            </button>
          ))}
          <span className="ml-auto text-xs text-blue-600 font-medium">🔒 Photos visible to Admin only</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">🕐 Late By</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">📸 Photo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className={`hover:bg-slate-50 transition
                  ${a.status === 'absent' ? 'bg-red-50/30' : a.status === 'late' ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold text-slate-700">{a.staffName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{a.date}</td>
                  <td className="px-4 py-4">
                    {a.punchIn
                      ? <span className="flex items-center gap-1 text-slate-700 font-mono font-medium text-xs"><Clock size={11} className="text-slate-400" />{a.punchIn}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    <LateBadge punchIn={a.punchIn} lateMinutes={a.computedLate} shiftStart={shiftStart} graceMins={graceMins} />
                  </td>
                  <td className="px-4 py-4">
                    {a.punchOut
                      ? <span className="text-slate-600 font-mono text-xs">{a.punchOut}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs max-w-[130px] truncate">{a.location || '—'}</td>
                  <td className="px-4 py-4">
                    {a.photo ? (
                      <button onClick={() => setPreviewPhoto({ photo: a.photo, name: a.staffName, date: a.date, late: a.computedLate })}
                        className="relative group">
                        <img src={a.photo} alt="" className="w-12 h-9 rounded-lg object-cover border-2 border-slate-100 group-hover:border-blue-400 transition" />
                      </button>
                    ) : <span className="text-slate-300 text-xs">No photo</span>}
                  </td>
                  <td className="px-4 py-4"><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No records</div>}
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Grace Period (minutes)</label>
                <input type="number" value={graceMins} onChange={e => setGraceMins(Number(e.target.value))} min={0} max={60}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base font-bold text-yellow-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50" />
                <p className="text-xs text-slate-400 mt-1">Staff arriving within {graceMins} mins of shift start will be marked "On Time"</p>
              </div>
              {/* Preview */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                <p>✅ On time if arrives before: <strong className="text-green-700">{(() => { const [h,m]=shiftStart.split(':').map(Number); const t=h*60+m+graceMins; return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; })()} </strong></p>
                <p>🔴 Late if arrives after: <strong className="text-red-600">{(() => { const [h,m]=shiftStart.split(':').map(Number); const t=h*60+m+graceMins; return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; })()} </strong></p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-800">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
          <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewPhoto(null)} className="absolute -top-9 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"><X size={16} /> Close</button>
            <img src={previewPhoto.photo} alt="" className="w-full rounded-2xl shadow-2xl" />
            <div className="mt-3 text-center">
              <p className="text-white font-bold">{previewPhoto.name}</p>
              <p className="text-slate-400 text-xs mt-1">{previewPhoto.date}</p>
              {previewPhoto.late > 0 && (
                <span className="inline-block mt-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🕐 {formatLate(previewPhoto.late)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
