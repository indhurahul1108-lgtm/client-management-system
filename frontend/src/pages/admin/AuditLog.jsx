import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Printer } from 'lucide-react';

const ACTION_COLOR = {
  LOGIN:'bg-blue-100 text-blue-700', LOGOUT:'bg-slate-100 text-slate-600',
  LEAVE_APPROVED:'bg-green-100 text-green-700', LEAVE_REJECTED:'bg-red-100 text-red-700',
  CLIENT_ADDED:'bg-purple-100 text-purple-700', PUNCH_IN:'bg-teal-100 text-teal-700',
  SALARY_UPDATED:'bg-orange-100 text-orange-700', STAFF_DEACTIVATED:'bg-red-100 text-red-700',
  LEAVE_APPLIED:'bg-yellow-100 text-yellow-700', WORK_UPDATED:'bg-blue-100 text-blue-700',
  ATTENDANCE_CORRECTED:'bg-yellow-100 text-yellow-700', WORK_ASSIGNED:'bg-purple-100 text-purple-700',
  SETTINGS_UPDATED:'bg-slate-100 text-slate-600', CLIENT_UPDATED:'bg-indigo-100 text-indigo-700',
};

const LOGS = [
  { id:'al001', user:'Admin',       action:'LOGIN',               module:'Auth',       desc:'Admin logged in successfully',                            time:'2026-10-08T10:00:00', ip:'192.168.1.10' },
  { id:'al002', user:'Admin',       action:'LEAVE_APPROVED',      module:'Leave',      desc:'Leave approved for Murugan P (Sick Leave Oct 10-11)',     time:'2026-10-08T09:45:00', ip:'192.168.1.10' },
  { id:'al003', user:'Admin',       action:'CLIENT_ADDED',        module:'Clients',    desc:'New client Delta Logistics added (ID: C010)',             time:'2026-10-08T09:30:00', ip:'192.168.1.10' },
  { id:'al004', user:'Priya Nair',  action:'LOGIN',               module:'Auth',       desc:'Manager logged in',                                       time:'2026-10-08T09:05:00', ip:'192.168.1.20' },
  { id:'al005', user:'Anitha Devi', action:'PUNCH_IN',            module:'Attendance', desc:'Staff punched in at 10:05 AM — Chennai, Tamil Nadu',     time:'2026-10-08T10:05:00', ip:'192.168.1.30' },
  { id:'al006', user:'Admin',       action:'SALARY_UPDATED',      module:'Salary',     desc:'Salary updated for Deepa S — Oct 2026',                 time:'2026-10-07T16:00:00', ip:'192.168.1.10' },
  { id:'al007', user:'Admin',       action:'STAFF_DEACTIVATED',   module:'Staff',      desc:'Staff account deactivated: Senthil K',                   time:'2026-10-07T15:30:00', ip:'192.168.1.10' },
  { id:'al008', user:'Murugan P',   action:'LEAVE_APPLIED',       module:'Leave',      desc:'Leave applied: Sick Leave Oct 10-11',                    time:'2026-10-07T14:00:00', ip:'192.168.1.25' },
  { id:'al009', user:'Anitha Devi', action:'WORK_UPDATED',        module:'Work',       desc:'Work WRK-001 status updated to In Progress (65%)',       time:'2026-10-07T11:00:00', ip:'192.168.1.30' },
  { id:'al010', user:'Admin',       action:'ATTENDANCE_CORRECTED',module:'Attendance', desc:'Attendance corrected for Ravi Kumar — Oct 7 (Absent→Present)',time:'2026-10-07T10:00:00', ip:'192.168.1.10' },
  { id:'al011', user:'Vijay S',     action:'PUNCH_IN',            module:'Attendance', desc:'Staff punched in at 10:35 AM (Late) — Chennai',          time:'2026-10-08T10:35:00', ip:'192.168.1.40' },
  { id:'al012', user:'Admin',       action:'WORK_ASSIGNED',       module:'Work',       desc:'New work WRK-009 assigned to Anitha Devi',               time:'2026-10-06T09:00:00', ip:'192.168.1.10' },
  { id:'al013', user:'Priya Nair',  action:'LEAVE_APPROVED',      module:'Leave',      desc:'Leave approved for Lavanya M',                           time:'2026-10-06T14:00:00', ip:'192.168.1.20' },
  { id:'al014', user:'Karthik Raja',action:'CLIENT_UPDATED',      module:'Clients',    desc:'Client Prime Builders info updated',                     time:'2026-10-05T16:30:00', ip:'192.168.1.22' },
  { id:'al015', user:'Admin',       action:'SETTINGS_UPDATED',    module:'Settings',   desc:'Shift time updated: 10:00 AM, Grace: 10 mins',           time:'2026-10-05T09:00:00', ip:'192.168.1.10' },
];

const MODULES = ['all','Auth','Leave','Attendance','Work','Clients','Salary','Settings','Staff'];

export default function AuditLog() {
  const [search, setSearch]   = useState('');
  const [module, setModule]   = useState('all');

  const filtered = LOGS.filter(l =>
    (module==='all'||l.module===module) &&
    (l.user.toLowerCase().includes(search.toLowerCase()) || l.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Audit Log">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 mb-5 flex items-center gap-2">
        🔒 Audit logs cannot be deleted. All important actions are automatically recorded for compliance and security.
      </div>

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by user or description..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"/>
        </div>
        <select value={module} onChange={e=>setModule(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          {MODULES.map(m=><option key={m} value={m}>{m==='all'?'All Modules':m}</option>)}
        </select>
        <button onClick={()=>window.print()} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200">
          <Printer size={14}/> Export
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>{['#','User','Action','Module','Description','Time','IP'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l,i)=>(
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{i+1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 text-xs">{l.user}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${ACTION_COLOR[l.action]||'bg-slate-100 text-slate-600'}`}>{l.action}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.module}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[250px] truncate" title={l.desc}>{l.desc}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(l.time).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<p className="text-center py-8 text-slate-400 text-sm">No audit records found</p>}
        <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400">Showing {filtered.length} of {LOGS.length} records</div>
      </div>
    </DashboardLayout>
  );
}
