import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { AlertTriangle, Phone } from 'lucide-react';

export default function ManagerOverdue() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u=>u.role==='staff'&&u.managerId===mId);
  const myStaffIds = myStaff.map(s=>s.staffId);
  const overdueWorks = CLIENT_WORKS.filter(w=>myStaffIds.includes(w.staffId)&&(w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed')));

  const priorityColor = p=>p==='high'?'bg-red-100 text-red-700':p==='medium'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700';

  return (
    <DashboardLayout title="Overdue Work">
      {overdueWorks.length>0 ? (
        <>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="text-white"/>
            </div>
            <div>
              <p className="font-bold text-red-700">⚠️ {overdueWorks.length} Overdue Item{overdueWorks.length>1?'s':''}</p>
              <p className="text-red-600 text-sm">Immediate action required. Contact assigned staff.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Work ID','Work Name','Client','Assigned Staff','Due Date','Overdue','Priority','Status','Last Updated'].map(h=>(
                      <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {overdueWorks.map(w=>{
                    const days = calcOverdueDays(w.dueDate);
                    const myClients = DUMMY_USERS.filter(u=>u.role==='client');
                    const client = myClients.find(c=>c.clientId===w.clientId);
                    return (
                      <tr key={w.id} className="hover:bg-red-50/30 transition bg-red-50/10">
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{w.workId}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700 max-w-[160px] truncate">{w.title}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{client?.name||w.clientId}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{w.staffName}</td>
                        <td className="px-4 py-3 text-red-600 font-semibold text-xs">{w.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            <AlertTriangle size={10}/> +{days} {days===1?'Day':'Days'}
                          </span>
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${priorityColor(w.priority)}`}>{w.priority}</span></td>
                        <td className="px-4 py-3"><span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold capitalize">{w.status}</span></td>
                        <td className="px-4 py-3 text-xs text-slate-400">{w.lastUpdated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-700">No Overdue Work!</h2>
          <p className="text-slate-400 text-sm mt-2">All work is on track. Great job team!</p>
        </div>
      )}
    </DashboardLayout>
  );
}
