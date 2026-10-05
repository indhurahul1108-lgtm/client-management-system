import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { Plus, X } from 'lucide-react';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Emergency Leave'];

function Badge({ status }) {
  const map = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status]}`}>{status}</span>;
}

export default function StaffLeave() {
  const { user } = useAuth();
  const myLeaves = DUMMY_LEAVES.filter(l => l.staffId === user?.id);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leaveType: '', fromDate: '', toDate: '', reason: '' });
  const [leaves, setLeaves] = useState(myLeaves);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: `l${Date.now()}`,
      staffId: user.id,
      staffName: user.name,
      ...form,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaves(prev => [newLeave, ...prev]);
    setForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <DashboardLayout title="Leave Management">
      {/* Apply button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-600 text-sm">Manage your leave applications</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition"
        >
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Success toast */}
      {submitted && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          ✅ Leave application submitted successfully!
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending',  count: leaves.filter(l => l.status === 'pending').length,  color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
          { label: 'Approved', count: leaves.filter(l => l.status === 'approved').length, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Rejected', count: leaves.filter(l => l.status === 'rejected').length, color: 'bg-red-50 text-red-700 border-red-100' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} border rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">My Applications</h2>
        </div>
        {leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">From</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Applied</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{l.leaveType}</td>
                    <td className="px-4 py-3 text-slate-500">{l.fromDate}</td>
                    <td className="px-4 py-3 text-slate-500">{l.toDate}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate">{l.reason}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{l.appliedOn}</td>
                    <td className="px-4 py-3"><Badge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">No leave applications yet</div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Apply for Leave</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Leave Type</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select type...</option>
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">From Date</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">To Date</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required rows={3}
                  placeholder="Reason for leave..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
