import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Search, X, Phone, MapPin, CalendarCheck, Clock, AlertTriangle, Briefcase } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

export default function ManagerStaff() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === mId);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const filtered = myStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.mobile || '').includes(search)
  );

  const getAtt = (id) => DUMMY_ATTENDANCE.find(a => a.userId === id && a.date === today);
  const getLeave = (id) => DUMMY_LEAVES.filter(l => l.staffId === id);
  const getWork = (staffId) => CLIENT_WORKS.filter(w => w.staffId === staffId);

  const presentCount = myStaff.filter(s => getAtt(s.id)?.status === 'present').length;
  const absentCount  = myStaff.filter(s => getAtt(s.id)?.status === 'absent').length;
  const lateCount    = myStaff.filter(s => getAtt(s.id)?.status === 'late').length;

  const attColor = (st) => st==='present'?'bg-green-100 text-green-700':st==='late'?'bg-yellow-100 text-yellow-700':st==='absent'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-500';

  return (
    <DashboardLayout title="My Staff">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[['Total',myStaff.length,'blue'],['Present',presentCount,'green'],['Absent',absentCount,'red'],['Late',lateCount,'yellow']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-3 text-slate-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff by name or mobile..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"/>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const att = getAtt(s.id);
          const works = getWork(s.staffId);
          const overdue = works.filter(w=>w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed')).length;
          return (
            <div key={s.id} onClick={()=>setSelected(s)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition hover:border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <img src={s.photo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100"/>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.staffId?.toUpperCase()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{s.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div className="bg-slate-50 rounded-xl p-2">
                  <p className="text-xs text-slate-400">Today</p>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${attColor(att?.status)}`}>{att?.status||'—'}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <p className="text-xs text-slate-400">Works</p>
                  <p className="font-bold text-slate-700 text-sm">{works.length}</p>
                </div>
                <div className={`rounded-xl p-2 ${overdue>0?'bg-red-50':'bg-slate-50'}`}>
                  <p className="text-xs text-slate-400">Overdue</p>
                  <p className={`font-bold text-sm ${overdue>0?'text-red-600':'text-slate-700'}`}>{overdue}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                <Phone size={11}/> {s.mobile}
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 text-white rounded-t-2xl flex items-center gap-4">
              <img src={selected.photo} alt="" className="w-16 h-16 rounded-xl border-2 border-white/30 object-cover"/>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-purple-200 text-xs">{selected.staffId?.toUpperCase()} · {selected.status}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30"><X size={16}/></button>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-4">
              {['profile','attendance','leave','work'].map(t=>(
                <button key={t} onClick={()=>setActiveTab(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition ${activeTab===t?'bg-purple-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>
              ))}
            </div>
            <div className="p-4">
              {activeTab==='profile' && (
                <div className="space-y-3">
                  {[['Mobile',selected.mobile],['Address',selected.address],['Join Date',selected.joinDate],['Salary',selected.salary?`₹${selected.salary?.toLocaleString('en-IN')}`:'—']].map(([l,v])=>(
                    <div key={l} className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs text-slate-400 font-semibold uppercase">{l}</span>
                      <span className="text-sm font-medium text-slate-700">{v||'—'}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==='attendance' && (
                <div className="space-y-2">
                  {DUMMY_ATTENDANCE.filter(a=>a.userId===selected.id).map(a=>(
                    <div key={a.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-slate-500">{a.date}</span>
                      <span className="text-xs font-mono text-slate-600">{a.punchIn||'—'} → {a.punchOut||'—'}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${attColor(a.status)}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==='leave' && (
                <div className="space-y-2">
                  {DUMMY_LEAVES.filter(l=>l.staffId===selected.id).map(l=>(
                    <div key={l.id} className="bg-slate-50 rounded-xl px-3 py-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">{l.leaveType}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${l.status==='approved'?'bg-green-100 text-green-700':l.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{l.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{l.fromDate} → {l.toDate} · {l.reason}</p>
                    </div>
                  ))}
                  {DUMMY_LEAVES.filter(l=>l.staffId===selected.id).length===0 && <p className="text-center py-4 text-slate-400 text-sm">No leave history</p>}
                </div>
              )}
              {activeTab==='work' && (
                <div className="space-y-2">
                  {CLIENT_WORKS.filter(w=>w.staffId===selected.staffId).map(w=>(
                    <div key={w.id} className="bg-slate-50 rounded-xl px-3 py-2.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">{w.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0 ${w.status==='completed'?'bg-green-100 text-green-700':w.status==='overdue'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{w.status}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{width:`${w.progress}%`}}/>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{w.progress}% · Due: {w.dueDate}</p>
                    </div>
                  ))}
                  {CLIENT_WORKS.filter(w=>w.staffId===selected.staffId).length===0 && <p className="text-center py-4 text-slate-400 text-sm">No work assigned</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
