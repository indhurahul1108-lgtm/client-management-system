import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

function Badge({ status }) {
  const map = {
    overdue:   'bg-red-100 text-red-700',
    pending:   'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function StaffOverdue() {
  const { user } = useAuth();
  const myOverdue = DUMMY_OVERDUE.filter(o => o.staffId === user?.staffId);

  const overdue   = myOverdue.filter(o => o.status === 'overdue').length;
  const pending   = myOverdue.filter(o => o.status === 'pending').length;
  const completed = myOverdue.filter(o => o.status === 'completed').length;

  return (
    <DashboardLayout title="My Overdue Tasks">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
          <AlertTriangle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-700">{overdue}</p>
          <p className="text-sm text-red-500 font-medium">Overdue</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 text-center">
          <Clock size={24} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-sm text-yellow-500 font-medium">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
          <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-700">{completed}</p>
          <p className="text-sm text-green-500 font-medium">Completed</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Task List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Overdue Days</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Remarks</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myOverdue.length > 0 ? myOverdue.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">{o.clientName}</td>
                  <td className="px-4 py-4 text-slate-600 max-w-xs truncate">{o.task}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{o.dueDate}</td>
                  <td className="px-4 py-4 text-center">
                    {o.overdueDays > 0
                      ? <span className="text-red-600 font-bold">+{o.overdueDays}d</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">{o.remarks}</td>
                  <td className="px-4 py-4"><Badge status={o.status} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    🎉 No overdue tasks! Great work!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
