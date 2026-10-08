import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Search } from 'lucide-react';

const TYPE_COLORS = { invoice:'bg-blue-100 text-blue-700', agreement:'bg-purple-100 text-purple-700', report:'bg-green-100 text-green-700', document:'bg-orange-100 text-orange-700', payslip:'bg-teal-100 text-teal-700', notice:'bg-red-100 text-red-700' };

const DOCS = [
  { id:'d1', name:'Appointment Letter',          type:'document',  size:'180 KB', date:'2026-01-15', icon:'📄' },
  { id:'d2', name:'Salary Slip — Sep 2026',      type:'payslip',   size:'95 KB',  date:'2026-10-01', icon:'💰' },
  { id:'d3', name:'Company Policy Document',     type:'document',  size:'320 KB', date:'2026-01-10', icon:'📋' },
  { id:'d4', name:'Increment Letter — 2026',     type:'document',  size:'130 KB', date:'2026-04-01', icon:'🎉' },
  { id:'d5', name:'Leave Policy 2026',           type:'notice',    size:'85 KB',  date:'2026-01-01', icon:'📌' },
  { id:'d6', name:'Training Certificate',        type:'report',    size:'245 KB', date:'2026-03-15', icon:'🏆' },
];

export default function StaffDocuments() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const types = ['all', ...new Set(DOCS.map(d=>d.type))];
  const filtered = DOCS.filter(d=>
    (typeFilter==='all'||d.type===typeFilter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Documents">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5 text-green-700 text-sm">
        📁 Only your personal documents are shown here. Contact admin for additional documents.
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t=>(
            <button key={t} onClick={()=>setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${typeFilter===t?'bg-green-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d=>(
          <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition hover:border-green-200">
            <div className="text-4xl mb-3">{d.icon}</div>
            <p className="font-bold text-slate-800 text-sm mb-1 truncate">{d.name}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${TYPE_COLORS[d.type]||'bg-slate-100 text-slate-600'}`}>{d.type}</span>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>{d.size}</span>
              <span>{d.date}</span>
            </div>
            <button onClick={()=>alert('Document will open here when connected to Supabase storage.')}
              className="w-full mt-3 bg-green-50 border border-green-200 text-green-700 py-2 rounded-xl text-xs font-bold hover:bg-green-100 transition">
              📥 View / Download
            </button>
          </div>
        ))}
        {filtered.length===0&&<div className="col-span-3 text-center py-12 text-slate-400">No documents found</div>}
      </div>
    </DashboardLayout>
  );
}
