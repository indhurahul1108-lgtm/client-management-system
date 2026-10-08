import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { X, Send } from 'lucide-react';

const NOTIFS_INIT = [
  { id:1,  title:'Leave Request — Murugan P',     msg:'Sick Leave requested for Oct 10-11. Pending approval.',          type:'leave',   icon:'📋', unread:true,  time:'2026-10-08T09:30:00' },
  { id:2,  title:'⚠️ Work Overdue — GST Filing', msg:'Sri Tech GST Filing is 3 days overdue.',                         type:'overdue', icon:'⚠️', unread:true,  time:'2026-10-08T08:00:00' },
  { id:3,  title:'Staff Late — Vijay S',          msg:'Vijay S punched in at 10:35 AM (25 mins late).',                 type:'attend',  icon:'🕐', unread:true,  time:'2026-10-08T10:36:00' },
  { id:4,  title:'New Client Registered',         msg:'Delta Logistics has been added as a new client.',               type:'client',  icon:'🏢', unread:false, time:'2026-10-08T09:00:00' },
  { id:5,  title:'Work Completed ✅',             msg:'Annual Audit for Sri Tech completed by Anitha Devi.',            type:'work',    icon:'✅', unread:false, time:'2026-10-07T18:00:00' },
  { id:6,  title:'⚠️ TDS Filing Overdue',         msg:'Global Traders TDS Return is 5 days overdue.',                  type:'overdue', icon:'⚠️', unread:true,  time:'2026-10-07T08:00:00' },
  { id:7,  title:'Staff Absent — Ravi Kumar',     msg:'Ravi Kumar has not punched in today.',                          type:'attend',  icon:'🔴', unread:false, time:'2026-10-08T11:00:00' },
  { id:8,  title:'Salary Pending — 3 Staff',      msg:'October salary not yet processed for 3 staff members.',         type:'salary',  icon:'💰', unread:false, time:'2026-10-07T09:00:00' },
  { id:9,  title:'Leave Approved',                msg:'Deepa S Annual Leave Oct 20-23 has been approved.',             type:'leave',   icon:'✅', unread:false, time:'2026-10-06T14:00:00' },
  { id:10, title:'Work Due Tomorrow',             msg:'Export Documentation for Sunrise Exports due tomorrow.',        type:'work',    icon:'📅', unread:true,  time:'2026-10-07T10:00:00' },
  { id:11, title:'New Staff Leave Request',       msg:'Lavanya M applied for Casual Leave Oct 25.',                   type:'leave',   icon:'📋', unread:false, time:'2026-10-06T11:00:00' },
  { id:12, title:'System: Shift Time Updated',    msg:'Admin updated shift to 10:00 AM with 10 min grace.',           type:'system',  icon:'⚙️', unread:false, time:'2026-10-05T09:00:00' },
];

const TYPES = ['all','leave','overdue','attend','work','client','salary','system'];

function groupByDate(notifs) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
  const groups = { Today:[], Yesterday:[], Earlier:[] };
  notifs.forEach(n=>{ const d=n.time.split('T')[0]; if(d===today) groups.Today.push(n); else if(d===yesterday) groups.Yesterday.push(n); else groups.Earlier.push(n); });
  return groups;
}

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState(NOTIFS_INIT);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announce, setAnnounce] = useState({ target:'all', title:'', msg:'' });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = msg => { setToastMsg(msg); setTimeout(()=>setToastMsg(''),3000); };

  const markRead = id => setNotifs(p=>p.map(n=>n.id===id?{...n,unread:false}:n));
  const markAll  = () => setNotifs(p=>p.map(n=>({...n,unread:false})));
  const sendAnnouncement = () => {
    if (!announce.title || !announce.msg) { showToast('⚠️ Fill all fields'); return; }
    setShowAnnounce(false);
    setAnnounce({target:'all',title:'',msg:''});
    showToast('📢 Announcement sent to all users!');
  };

  const unread = notifs.filter(n=>n.unread).length;
  let shown = notifs;
  if (filter==='unread') shown = shown.filter(n=>n.unread);
  if (typeFilter!=='all') shown = shown.filter(n=>n.type===typeFilter);
  const groups = groupByDate(shown);

  return (
    <DashboardLayout title="Notifications">
      {toastMsg&&<div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">{toastMsg}</div>}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          {['all','unread'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${filter===f?'bg-blue-700 text-white':'bg-white text-slate-600 border border-slate-200'}`}>
              {f} {f==='unread'&&unread>0&&<span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unread}</span>}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none">
          {TYPES.map(t=><option key={t} value={t} className="capitalize">{t==='all'?'All Types':t}</option>)}
        </select>
        {unread>0&&<button onClick={markAll} className="text-xs text-blue-600 font-semibold hover:text-blue-800">Mark all read</button>}
        <button onClick={()=>setShowAnnounce(true)} className="ml-auto flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-800">
          <Send size={14}/> Send Announcement
        </button>
      </div>

      {Object.entries(groups).map(([label,items])=>items.length>0&&(
        <div key={label} className="mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {items.map(n=>(
              <div key={n.id} onClick={()=>markRead(n.id)}
                className={`px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 transition ${n.unread?'bg-blue-50/30 border-l-4 border-l-blue-500':''}`}>
                <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1"><p className={`text-sm ${n.unread?'font-bold text-slate-800':'font-medium text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                  <p className="text-xs text-slate-300 mt-1">{new Date(n.time).toLocaleString('en-IN')}</p>
                </div>
                {n.unread&&<div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {shown.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">🎉</div><p className="text-slate-400">All caught up!</p></div>}

      {/* Announcement Modal */}
      {showAnnounce&&(
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setShowAnnounce(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">📢 Send Announcement</h3>
              <button onClick={()=>setShowAnnounce(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Send To</label>
                <select value={announce.target} onChange={e=>setAnnounce(a=>({...a,target:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {['all','managers','staff','clients'].map(t=><option key={t} value={t} className="capitalize">{t==='all'?'All Users':t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Title</label>
                <input value={announce.title} onChange={e=>setAnnounce(a=>({...a,title:e.target.value}))} placeholder="Announcement title" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Message</label>
                <textarea value={announce.msg} onChange={e=>setAnnounce(a=>({...a,msg:e.target.value}))} rows={3} placeholder="Type your message..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAnnounce(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={sendAnnouncement} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-800 flex items-center justify-center gap-2"><Send size={14}/> Send</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
