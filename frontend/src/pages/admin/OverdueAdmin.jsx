import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { AlertTriangle } from 'lucide-react';

function Badge({ status }) {
  const map = { overdue: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function OverdueAdmin() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? DUMMY_OVERDUE : DUMMY_OVERDUE.filter(o => o.status === filter);

  const rowBg = {
    overdue:   'bg-red-50/50',
    pending:   'bg-yellow-50/50',
    completed: 'bg-green-50/20',
  };

  return (
    <DashboardLayout title="Overdue Management">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Overdue',   count: DUMMY_OVERDUE.filter(o => o.status === 'overdue').length,   color: 'bg-red-50 border-red-100 text-red-700' },
          { label: 'Pending',   count: DUMMY_OVERDUE.filter(o => o.status === 'pending').length,   color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
          { label: 'Completed', count: DUMMY_OVERDUE.filter(o => o.status === 'completed').length, color: 'bg-green-50 border-green-100 text-green-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} border rounded-2xl p-5 text-center`}>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          {['all', 'overdue', 'pending', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition
                ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Overdue Days</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Remarks</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(o => (
                <tr key={o.id} className={`hover:bg-slate-50 transition ${rowBg[o.status] || ''}`}>
                  <td className="px-6 py-4 font-semibold text-slate-700">{o.clientName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{o.staffName}</td>
                  <td className="px-4 py-4 text-slate-600 max-w-[200px] truncate">{o.task}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{o.dueDate}</td>
                  <td className="px-4 py-4 text-center">
                    {o.overdueDays > 0 ? (
                      <span className="text-red-600 font-bold text-sm">+{o.overdueDays}d</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs max-w-[150px] truncate">{o.remarks}</td>
                  <td className="px-4 py-4"><Badge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No overdue items found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
