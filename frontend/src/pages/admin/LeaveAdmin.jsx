import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { Check, X, MessageSquare } from 'lucide-react';

function Badge({ status }) {
  const map = { pending:'bg-yellow-100 text-yellow-700', approved:'bg-green-100 text-green-700', rejected:'bg-red-100 text-red-700', cancelled:'bg-slate-100 text-slate-600' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status]||'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

function Toast({ msg, color }) {
  return <div className={`fixed top-4 right-4 z-50 ${color} text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold`}>{msg}</div>;
}

export default function LeaveAdmin() {
  const [leaves, setLeaves]         = useState(DUMMY_LEAVES);
  const [filter, setFilter]         = useState('all');
  const [rejectModal, setRejectModal] = useState(null); // { id, staffName }
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast]           = useState(null);

  const showToast = (msg, color = 'bg-green-600') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const approve = (id) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    showToast('✅ Leave approved!');
  };

  const openReject = (leave) => {
    setRejectReason('');
    setRejectModal(leave);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) { showToast('⚠️ Please enter rejection reason', 'bg-red-500'); return; }
    setLeaves(prev => prev.map(l => l.id === rejectModal.id
      ? { ...l, status: 'rejected', rejectReason }
      : l
    ));
    setRejectModal(null);
    showToast('❌ Leave rejected with reason sent to staff.');
  };

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <DashboardLayout title="Leave Management">
      {toast && <Toast msg={toast.msg} color={toast.color} />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Pending',  leaves.filter(l=>l.status==='pending').length,  'yellow'],
          ['Approved', leaves.filter(l=>l.status==='approved').length, 'green'],
          ['Rejected', leaves.filter(l=>l.status==='rejected').length, 'red'],
          ['Total',    leaves.length,                                   'blue'],
        ].map(([label, count, c]) => (
          <div key={label} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${c}-700`}>{count}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter tabs */}
        <div className="px-5 py-4 border-b border-slate-100 flex gap-2 flex-wrap">
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition
                ${filter===f?'bg-blue-700 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Staff','Leave Type','From','To','Reason','Applied','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-700 text-xs whitespace-nowrap">{l.staffName}</td>
                  <td className="px-4 py-3 text-xs">{l.leaveType}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.fromDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.toDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px]">
                    <p className="truncate">{l.reason}</p>
                    {l.rejectReason && (
                      <p className="text-red-500 text-xs mt-0.5">
                        <span className="font-semibold">Reason: </span>{l.rejectReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{l.appliedOn}</td>
                  <td className="px-4 py-3"><Badge status={l.status}/></td>
                  <td className="px-4 py-3">
                    {l.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => approve(l.id)}
                          className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100">
                          <Check size={12}/> Approve
                        </button>
                        <button onClick={() => openReject(l)}
                          className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100">
                          <X size={12}/> Reject
                        </button>
                      </div>
                    )}
                    {l.status !== 'pending' && <span className="text-xs text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No leave records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Reject Reason Modal ─────────────────────────────── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} className="text-red-600"/>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Reject Leave</h3>
                <p className="text-xs text-slate-400">{rejectModal.staffName} — {rejectModal.leaveType}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-xs text-red-600">
              ⚠️ Rejection reason will be sent to the staff member.
            </div>

            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Rejection Reason *</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              placeholder="e.g. Insufficient leave balance / Critical project deadline / Please reschedule..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="flex gap-3 mt-4">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">
                Cancel
              </button>
              <button onClick={confirmReject}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
