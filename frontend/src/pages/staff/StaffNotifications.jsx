import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const NOTIFS = [
  { id:1, title:'New Bunk Shift Assigned', msg:'Morning Shift at IOCL Anna Salai has been assigned to you.',  icon:'⛽', unread:true,  time:'2026-10-08T09:00:00' },
  { id:2, title:'Shift Due Tomorrow',      msg:'Evening Shift duty at BPCL Guindy starts at 02:00 PM tomorrow.',icon:'📅', unread:true,  time:'2026-10-08T08:00:00' },
  { id:3, title:'⚠️ Shift Punch-In Reminder', msg:'Please complete camera punch-in upon reaching fuel pump.',   icon:'⚠️', unread:true,  time:'2026-10-08T08:00:00' },
  { id:4, title:'Leave Approved ✅',        msg:'Your leave request for Oct 20-22 has been approved.',          icon:'✅', unread:false, time:'2026-10-07T14:00:00' },
  { id:5, title:'Duty Status Updated',     msg:'Manager confirmed cash collection signoff for Morning shift.', icon:'🔄', unread:false, time:'2026-10-07T11:00:00' },
  { id:6, title:'Manager Message',         msg:'Please ensure fuel density log sheet is submitted by 02:00 PM.',icon:'💬', unread:false, time:'2026-10-07T10:00:00' },
  { id:7, title:'Bunk Request',            msg:'IOCL Bunk requested 2 extra operators for rush hours.',         icon:'🏢', unread:false, time:'2026-10-06T09:00:00' },
  { id:8, title:'Admin Announcement',      msg:'Diwali special bonus and roster timings updated for staff.',   icon:'📢', unread:false, time:'2026-10-05T09:00:00' },
];

function groupByDate(notifs) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
  const groups = { Today:[], Yesterday:[], Earlier:[] };
  notifs.forEach(n=>{ const d=n.time.split('T')[0]; if(d===today) groups.Today.push(n); else if(d===yesterday) groups.Yesterday.push(n); else groups.Earlier.push(n); });
  return groups;
}

export default function StaffNotifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState(() => {
    try {
      const live = JSON.parse(localStorage.getItem('cms_live_notifications') || '[]');
      const filtered = live.filter(n => !n.targetStaffId || n.targetStaffId === user?.staffId);
      return [...filtered, ...NOTIFS];
    } catch {
      return NOTIFS;
    }
  });
  const [filter, setFilter] = useState('all');

  const shown = filter==='all' ? notifs : notifs.filter(n=>n.unread);
  const unread = notifs.filter(n=>n.unread).length;
  const groups = groupByDate(shown);

  return (
    <DashboardLayout title="Notifications">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {['all','unread'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${filter===f?'bg-green-700 text-white':'bg-white text-slate-600 border border-slate-200'}`}>
              {f} {f==='unread'&&unread>0&&<span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unread}</span>}
            </button>
          ))}
        </div>
        {unread>0 && <button onClick={()=>setNotifs(p=>p.map(n=>({...n,unread:false})))} className="text-xs text-green-600 font-semibold">Mark all read</button>}
      </div>

      {Object.entries(groups).map(([label,items])=>items.length>0&&(
        <div key={label} className="mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {items.map(n=>(
              <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))}
                className={`px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 transition ${n.unread?'bg-green-50/30 border-l-4 border-l-green-500':''}`}>
                <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1"><p className={`text-sm ${n.unread?'font-bold text-slate-800':'font-medium text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                  <p className="text-xs text-slate-300 mt-1">{new Date(n.time).toLocaleString('en-IN')}</p>
                </div>
                {n.unread&&<div className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {shown.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">🎉</div><p className="text-slate-400">All caught up!</p></div>}
    </DashboardLayout>
  );
}
