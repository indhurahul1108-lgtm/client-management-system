import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Search, X, Phone, MapPin, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function ManagerClients() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === mId);
  const myStaffIds = myStaff.map(s => s.staffId);
  const myClients = DUMMY_USERS.filter(u => u.role === 'client' && myStaffIds.includes(u.assignedStaffId));

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = myClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.mobile||'').includes(search)
  );

  const getStaff = (sId) => myStaff.find(s => s.staffId === sId);
  const getWorks = (cId) => CLIENT_WORKS.filter(w => w.clientId === cId);

  const totalClients  = myClients.length;
  const totalActive   = myClients.reduce((n,c)=>n+getWorks(c.clientId).filter(w=>w.status==='in_progress').length,0);
  const totalOverdue  = myClients.reduce((n,c)=>n+getWorks(c.clientId).filter(w=>w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed')).length,0);

  return (
    <DashboardLayout title="My Clients">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Total Clients',totalClients,'purple'],['Active Work',totalActive,'blue'],['Overdue',totalOverdue,'red']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-3 text-slate-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"/>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(c => {
          const staff = getStaff(c.assignedStaffId);
          const works = getWorks(c.clientId);
          const active   = works.filter(w=>w.status==='in_progress').length;
          const completed= works.filter(w=>w.status==='completed').length;
          const overdue  = works.filter(w=>w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed')).length;
          return (
            <div key={c.id} onClick={()=>setSelected(c)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition hover:border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <img src={c.photo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100"/>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.service}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{c.status}</span>
              </div>
              {staff && (
                <div className="flex items-center gap-2 mb-3 bg-purple-50 rounded-xl p-2.5">
                  <img src={staff.photo} alt="" className="w-6 h-6 rounded-full object-cover"/>
                  <span className="text-xs text-purple-700 font-medium">{staff.name}</span>
                  <span className="text-xs text-purple-400 ml-auto">Assigned Staff</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 rounded-xl p-2"><p className="text-xs text-slate-400">Active</p><p className="font-bold text-blue-700">{active}</p></div>
                <div className="bg-green-50 rounded-xl p-2"><p className="text-xs text-slate-400">Done</p><p className="font-bold text-green-700">{completed}</p></div>
                <div className={`rounded-xl p-2 ${overdue>0?'bg-red-50':'bg-slate-50'}`}><p className="text-xs text-slate-400">Overdue</p><p className={`font-bold ${overdue>0?'text-red-600':'text-slate-500'}`}>{overdue}</p></div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="col-span-2 text-center py-12 text-slate-400">No clients found</div>}
      </div>

      {/* Client Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 text-white rounded-t-2xl flex items-center gap-4">
              <img src={selected.photo} alt="" className="w-14 h-14 rounded-xl border-2 border-white/30 object-cover"/>
              <div className="flex-1">
                <h3 className="font-bold">{selected.name}</h3>
                <p className="text-purple-200 text-xs">{selected.clientId?.toUpperCase()} · {selected.service}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><X size={16}/></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Mobile',selected.mobile],['Address',selected.address],['Status',selected.status],['Joined',selected.joinDate]].map(([l,v])=>(
                  <div key={l}>
                    <p className="text-xs text-slate-400 font-semibold uppercase">{l}</p>
                    <p className="font-medium text-slate-700 mt-0.5">{v||'—'}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Work</p>
                {getWorks(selected.clientId).map(w=>(
                  <div key={w.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5 mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{w.title}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1"><div className="bg-purple-500 h-1 rounded-full" style={{width:`${w.progress}%`}}/></div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 font-semibold ${w.status==='completed'?'bg-green-100 text-green-700':w.status==='overdue'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{w.status}</span>
                  </div>
                ))}
                {getWorks(selected.clientId).length===0 && <p className="text-slate-400 text-sm">No work assigned</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
