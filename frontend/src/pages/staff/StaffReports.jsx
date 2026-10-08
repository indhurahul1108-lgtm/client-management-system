import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_ATTENDANCE, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Printer } from 'lucide-react';

export default function StaffReports() {
  const { user } = useAuth();
  const [tab, setTab] = useState('attendance');

  const myAtt    = DUMMY_ATTENDANCE.filter(a => a.userId === user?.id);
  const myLeaves = DUMMY_LEAVES.filter(l => l.staffId === user?.id);
  const myWorks  = CLIENT_WORKS.filter(w => w.staffId === user?.staffId);
  const myOD     = myWorks.filter(w => w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed'));

  const attColor = s => s==='present'?'bg-green-100 text-green-700':s==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700';
  const sColor   = s => s==='approved'||s==='completed'?'bg-green-100 text-green-700':s==='rejected'||s==='overdue'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';

  return (
    <DashboardLayout title="My Reports">
      <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-xs text-green-700 mb-5">
        📊 These reports show only your personal records.
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {['attendance','leave','work','overdue'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${tab===t?'bg-green-700 text-white':'bg-white text-slate-600 border border-slate-200'}`}>{t}</button>
        ))}
        <button onClick={()=>window.print()} className="ml-auto flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200"><Printer size={14}/> Print</button>
      </div>

      <div id="report-content" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {tab==='attendance'&&(<>
          <div className="px-5 py-3 border-b border-slate-50 text-xs text-slate-400">Total: {myAtt.length} · Present: {myAtt.filter(a=>a.status==='present').length} · Late: {myAtt.filter(a=>a.status==='late').length} · Absent: {myAtt.filter(a=>a.status==='absent').length}</div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{['Date','Punch In','Punch Out','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">{myAtt.map(a=><tr key={a.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-xs text-slate-600">{a.date}</td>
              <td className="px-4 py-3 text-xs font-mono">{a.punchIn||'—'}</td>
              <td className="px-4 py-3 text-xs font-mono text-slate-500">{a.punchOut||'—'}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${attColor(a.status)}`}>{a.status}</span></td>
            </tr>)}</tbody>
          </table></div>
        </>)}
        {tab==='leave'&&(<>
          <div className="px-5 py-3 border-b border-slate-50 text-xs text-slate-400">Total: {myLeaves.length}</div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{['Type','From','To','Reason','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">{myLeaves.map(l=><tr key={l.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-xs font-medium">{l.leaveType}</td>
              <td className="px-4 py-3 text-xs">{l.fromDate}</td>
              <td className="px-4 py-3 text-xs">{l.toDate}</td>
              <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate">{l.reason}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${sColor(l.status)}`}>{l.status}</span></td>
            </tr>)}</tbody>
          </table></div>
        </>)}
        {tab==='work'&&(<>
          <div className="px-5 py-3 border-b border-slate-50 text-xs text-slate-400">Total: {myWorks.length}</div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{['Work ID','Title','Due Date','Progress','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">{myWorks.map(w=><tr key={w.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">{w.workId}</td>
              <td className="px-4 py-3 text-xs font-medium text-slate-700 max-w-[160px] truncate">{w.title}</td>
              <td className="px-4 py-3 text-xs">{w.dueDate}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-slate-100 rounded-full h-1.5"><div className="bg-green-600 h-1.5 rounded-full" style={{width:`${w.progress}%`}}/></div><span className="text-xs">{w.progress}%</span></div></td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${sColor(w.status)}`}>{w.status}</span></td>
            </tr>)}</tbody>
          </table></div>
        </>)}
        {tab==='overdue'&&(<>
          <div className="px-5 py-3 border-b border-slate-50 bg-red-50/50 text-xs text-red-600 font-semibold">⚠️ {myOD.length} overdue items</div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{['Work ID','Title','Due Date','Overdue Days','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">{myOD.map(w=><tr key={w.id} className="hover:bg-red-50/30 bg-red-50/10">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">{w.workId}</td>
              <td className="px-4 py-3 text-xs font-medium">{w.title}</td>
              <td className="px-4 py-3 text-xs text-red-600 font-semibold">{w.dueDate}</td>
              <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">+{calcOverdueDays(w.dueDate)}d</span></td>
              <td className="px-4 py-3"><span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Overdue</span></td>
            </tr>)}</tbody>
          </table></div>
        </>)}
      </div>
    </DashboardLayout>
  );
}
