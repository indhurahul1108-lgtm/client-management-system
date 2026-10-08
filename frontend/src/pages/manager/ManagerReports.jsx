import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Printer } from 'lucide-react';

export default function ManagerReports() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u=>u.role==='staff'&&u.managerId===mId);
  const myStaffIds = { userIds: myStaff.map(s=>s.id), staffIds: myStaff.map(s=>s.staffId) };
  const myClients = DUMMY_USERS.filter(u=>u.role==='client'&&myStaffIds.staffIds.includes(u.assignedStaffId));
  const myClientIds = myClients.map(c=>c.clientId);

  const [tab, setTab] = useState('attendance');
  const [statusFilter, setStatusFilter] = useState('all');

  const att  = DUMMY_ATTENDANCE.filter(a=>myStaffIds.userIds.includes(a.userId));
  const leaves = DUMMY_LEAVES.filter(l=>myStaff.find(s=>s.id===l.staffId));
  const works  = CLIENT_WORKS.filter(w=>myStaffIds.staffIds.includes(w.staffId));
  const overdue= works.filter(w=>w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed'));

  const attColor = s=>s==='present'?'bg-green-100 text-green-700':s==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700';
  const statusColor = s=>s==='approved'||s==='completed'?'bg-green-100 text-green-700':s==='rejected'||s==='overdue'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';

  const TABS = ['attendance','leave','work','overdue'];

  return (
    <DashboardLayout title="Reports">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${tab===t?'bg-purple-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{t}</button>
        ))}
        <button onClick={()=>window.print()} className="ml-auto flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200">
          <Printer size={14}/> Print / PDF
        </button>
      </div>

      <div id="report-content" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {tab==='attendance' && (<>
          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-xs text-slate-400">Total records: {att.length} · Present: {att.filter(a=>a.status==='present').length} · Late: {att.filter(a=>a.status==='late').length} · Absent: {att.filter(a=>a.status==='absent').length}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>{['Staff','Date','Punch In','Punch Out','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-50">
                {att.map(a=><tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700 text-xs">{a.staffName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{a.date}</td>
                  <td className="px-4 py-3 text-xs font-mono">{a.punchIn||'—'}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{a.punchOut||'—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${attColor(a.status)}`}>{a.status}</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </>)}

        {tab==='leave' && (<>
          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-xs text-slate-400">Total: {leaves.length} · Pending: {leaves.filter(l=>l.status==='pending').length} · Approved: {leaves.filter(l=>l.status==='approved').length}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>{['Staff','Type','From','To','Reason','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-50">
                {leaves.map(l=><tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700 text-xs">{l.staffName}</td>
                  <td className="px-4 py-3 text-xs">{l.leaveType}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.fromDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.toDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate">{l.reason}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor(l.status)}`}>{l.status}</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </>)}

        {tab==='work' && (<>
          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-xs text-slate-400">Total: {works.length} · Active: {works.filter(w=>w.status==='in_progress').length} · Completed: {works.filter(w=>w.status==='completed').length}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>{['Work ID','Title','Staff','Due Date','Progress','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-50">
                {works.map(w=><tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{w.workId}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 text-xs max-w-[160px] truncate">{w.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{w.staffName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{w.dueDate}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16"><div className="bg-purple-500 h-1.5 rounded-full" style={{width:`${w.progress}%`}}/></div><span className="text-xs text-slate-500">{w.progress}%</span></div></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor(w.status)}`}>{w.status}</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </>)}

        {tab==='overdue' && (<>
          <div className="px-5 py-4 border-b border-slate-50 bg-red-50/50">
            <p className="text-xs text-red-600 font-semibold">⚠️ {overdue.length} overdue items require attention</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>{['Work ID','Title','Staff','Due Date','Overdue Days','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-50">
                {overdue.map(w=><tr key={w.id} className="hover:bg-red-50/30 bg-red-50/10">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{w.workId}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 text-xs">{w.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{w.staffName}</td>
                  <td className="px-4 py-3 text-xs text-red-600 font-semibold">{w.dueDate}</td>
                  <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">+{calcOverdueDays(w.dueDate)}d</span></td>
                  <td className="px-4 py-3"><span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Overdue</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </>)}
      </div>
    </DashboardLayout>
  );
}
