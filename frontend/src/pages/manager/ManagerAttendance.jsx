import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { calcLateMinutes, formatLate, SHIFT_CONFIG } from '../../utils/attendanceUtils.js';
import { Clock, Camera, AlertTriangle, X } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];
const STATUS_FILTERS = ['all','present','late','absent'];

export default function ManagerAttendance() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role==='staff' && u.managerId===mId);
  const myStaffIds = myStaff.map(s=>s.id);

  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);

  const att = DUMMY_ATTENDANCE.filter(a => myStaffIds.includes(a.userId));
  const filtered = filter==='all' ? att : att.filter(a=>a.status===filter);

  const attColor = s => s==='present'?'bg-green-100 text-green-700':s==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700';

  const presentN = att.filter(a=>a.status==='present').length;
  const absentN  = att.filter(a=>a.status==='absent').length;
  const lateN    = att.filter(a=>a.status==='late').length;

  return (
    <DashboardLayout title="Staff Attendance">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[['Present',presentN,'green'],['Absent',absentN,'red'],['Late',lateN,'yellow']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Shift Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex gap-4 text-xs text-blue-700 mb-4">
        <span>⏰ Shift: <strong>{SHIFT_CONFIG.shiftStart}</strong></span>
        <span>⚡ Grace: <strong>{SHIFT_CONFIG.graceMins} mins</strong></span>
        <span>🔴 Late after: <strong>{(()=>{const[h,m]=SHIFT_CONFIG.shiftStart.split(':').map(Number);const t=h*60+m+SHIFT_CONFIG.graceMins;return`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`})()}</strong></span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="px-5 py-4 border-b border-slate-50 flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${filter===f?'bg-purple-700 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f==='all'?`All (${att.length})`:`${f} (${att.filter(a=>a.status===f).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Staff','Date','Punch In','Late By','Punch Out','Photo','Status'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a=>{
                const late = calcLateMinutes(a.punchIn,SHIFT_CONFIG.shiftStart,SHIFT_CONFIG.graceMins);
                return (
                  <tr key={a.id} className={`hover:bg-slate-50 transition ${a.status==='absent'?'bg-red-50/30':a.status==='late'?'bg-yellow-50/20':''}`}>
                    <td className="px-4 py-3 font-medium text-slate-700">{a.staffName}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.date}</td>
                    <td className="px-4 py-3 font-mono text-xs">{a.punchIn||'—'}</td>
                    <td className="px-4 py-3">
                      {late===null?<span className="text-slate-300">—</span>:late<=0?<span className="text-green-600 text-xs font-semibold">✓ On Time</span>:
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full"><AlertTriangle size={9}/>{formatLate(late)}</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.punchOut||'—'}</td>
                    <td className="px-4 py-3">
                      {a.photo?<button onClick={()=>setPreview(a)}><img src={a.photo} alt="" className="w-10 h-8 rounded-lg object-cover border border-slate-100 hover:border-purple-400"/></button>:<span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${attColor(a.status)}`}>{a.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length===0 && <p className="text-center py-8 text-slate-400 text-sm">No records</p>}
      </div>

      {/* Photo Preview */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={()=>setPreview(null)}>
          <div className="text-center" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setPreview(null)} className="text-white/70 flex items-center gap-1 mb-3 mx-auto hover:text-white text-sm"><X size={14}/> Close</button>
            <img src={preview.photo} alt="" className="rounded-2xl max-w-xs w-full shadow-2xl"/>
            <p className="text-white font-bold mt-3">{preview.staffName}</p>
            <p className="text-slate-400 text-xs mt-1">{preview.date} · {preview.punchIn}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
