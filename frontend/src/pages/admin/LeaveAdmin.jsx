import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { FileText, Check, X } from 'lucide-react';

function Badge({ status }) {
  const map = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status]}`}>{status}</span>;
}

export default function LeaveAdmin() {
  const [leaves, setLeaves] = useState(DUMMY_LEAVES);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <DashboardLayout title="Leave Management">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending',  count: leaves.filter(l => l.status === 'pending').length,  color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
          { label: 'Approved', count: leaves.filter(l => l.status === 'approved').length, color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Rejected', count: leaves.filter(l => l.status === 'rejected').length, color: 'bg-red-50 border-red-100 text-red-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} border rounded-2xl p-5 text-center`}>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter tabs */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Applied</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">{l.staffName}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{l.leaveType}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{l.fromDate}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{l.toDate}</td>
                  <td className="px-4 py-4 text-slate-400 text-xs max-w-xs truncate">{l.reason}</td>
                  <td className="px-4 py-4 text-slate-400 text-xs">{l.appliedOn}</td>
                  <td className="px-4 py-4"><Badge status={l.status} /></td>
                  <td className="px-4 py-4">
                    {l.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(l.id, 'approved')}
                          className="w-7 h-7 bg-green-100 text-green-700 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                          <Check size={13} />
                        </button>
                        <button onClick={() => updateStatus(l.id, 'rejected')}
                          className="w-7 h-7 bg-red-100 text-red-700 rounded-lg flex items-center justify-center hover:bg-red-200 transition">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No leave requests found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
