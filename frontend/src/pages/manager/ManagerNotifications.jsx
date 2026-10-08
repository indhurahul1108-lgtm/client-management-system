import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Bell, X } from 'lucide-react';

const NOTIFS = [
  { id:1, title:'Staff Leave Request', msg:'Anitha Devi applied for Sick Leave Oct 10-11. Action required.', type:'leave',   icon:'📋', unread:true,  time:'2026-10-08T09:30:00' },
  { id:2, title:'⚠️ Work Overdue',     msg:'GST Filing for Sri Tech is 3 days overdue.',                   type:'overdue', icon:'⚠️', unread:true,  time:'2026-10-08T08:00:00' },
  { id:3, title:'Staff Absent',        msg:'Ravi Kumar has not punched in today.',                          type:'attend',  icon:'🔴', unread:true,  time:'2026-10-08T11:00:00' },
  { id:4, title:'Work Completed ✅',   msg:'Annual Audit completed by Anitha Devi.',                       type:'work',    icon:'✅', unread:false, time:'2026-10-07T18:00:00' },
  { id:5, title:'Leave Approved',      msg:'Your leave request for Oct 20-22 has been approved by Admin.', type:'leave',   icon:'✅', unread:false, time:'2026-10-07T14:00:00' },
  { id:6, title:'New Work Assigned',   msg:'New work WRK-010 assigned to your team.',                      type:'work',    icon:'📌', unread:false, time:'2026-10-06T09:00:00' },
  { id:7, title:'Client Request',      msg:'Sri Tech submitted a new service request.',                     type:'client',  icon:'🏢', unread:false, time:'2026-10-06T11:00:00' },
  { id:8, title:'Admin Announcement',  msg:'Office will be closed on Oct 25 for Diwali.',                  type:'system',  icon:'📢', unread:false, time:'2026-10-05T09:00:00' },
];

function groupByDate(notifs) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
  const groups = { Today:[], Yesterday:[], Earlier:[] };
  notifs.forEach(n=>{
    const d=n.time.split('T')[0];
    if(d===today) groups.Today.push(n);
    else if(d===yesterday) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
}

export default function ManagerNotifications() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const [filter, setFilter] = useState('all');

  const markRead = (id) => setNotifs(prev=>prev.map(n=>n.id===id?{...n,unread:false}:n));
  const markAll  = () => setNotifs(prev=>prev.map(n=>({...n,unread:false})));

  const shown = filter==='all' ? notifs : notifs.filter(n=>n.unread);
  const unreadCount = notifs.filter(n=>n.unread).length;
  const groups = groupByDate(shown);

  return (
    <DashboardLayout title="Notifications">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {['all','unread'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${filter===f?'bg-purple-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              {f} {f==='unread'&&unreadCount>0&&<span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </button>
          ))}
        </div>
        {unreadCount>0 && (
          <button onClick={markAll} className="text-xs text-purple-600 font-semibold hover:text-purple-800">Mark all as read</button>
        )}
      </div>

      {Object.entries(groups).map(([label, items])=>items.length>0 && (
        <div key={label} className="mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {items.map(n=>(
              <div key={n.id} onClick={()=>markRead(n.id)}
                className={`px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer border-b border-slate-50 last:border-0
                  ${n.unread?'bg-purple-50/30 border-l-4 border-l-purple-400':''}`}>
                <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread?'font-bold text-slate-800':'font-medium text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{n.msg}</p>
                  <p className="text-xs text-slate-300 mt-1">{new Date(n.time).toLocaleString('en-IN')}</p>
                </div>
                {n.unread && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {shown.length===0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-slate-500 font-medium">All caught up! No notifications.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
