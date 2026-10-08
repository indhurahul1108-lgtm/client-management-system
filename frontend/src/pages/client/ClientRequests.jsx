import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getClientData } from '../../data/clientData.js';

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

const REQUEST_TYPES = [
  'Meeting Request',
  'Document Request',
  'Service Request',
  'Complaint',
  'Other',
];

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const today = () => new Date().toISOString().split('T')[0];

export default function ClientRequests() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const [requests, setRequests] = useState(data.requests);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    type: REQUEST_TYPES[0],
    reason: '',
    fromDate: today(),
    toDate: today(),
  });
  const [formError, setFormError] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.reason.trim()) {
      setFormError('Please enter a reason.');
      return;
    }
    const newReq = {
      id: `r${Date.now()}`,
      clientId: user?.clientId || 'c001',
      type: form.type,
      reason: form.reason,
      fromDate: form.fromDate,
      toDate: form.toDate,
      status: 'pending',
      appliedOn: today(),
      response: null,
    };
    setRequests((prev) => [newReq, ...prev]);
    setShowModal(false);
    setForm({ type: REQUEST_TYPES[0], reason: '', fromDate: today(), toDate: today() });
    setFormError('');
    showToast('Request submitted! We will respond within 24 hours.');
  };

  const filtered = requests.filter((r) => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter.toLowerCase();
  });

  return (
    <DashboardLayout title="My Requests">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span>✅</span> {toast}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                activeFilter === f
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors min-h-[44px] shadow"
        >
          <span className="text-lg leading-none">+</span> Submit New Request
        </button>
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-lg font-medium">No requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              {/* Type & Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-700">{req.type}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[req.status] || 'bg-slate-100 text-slate-600'}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>

              {/* Reason */}
              <p className="text-sm text-slate-600 line-clamp-2">{req.reason}</p>

              {/* Date Range */}
              <div className="flex gap-3 text-xs text-slate-500">
                <span>📅 {req.fromDate}</span>
                {req.toDate !== req.fromDate && <span>→ {req.toDate}</span>}
              </div>

              {/* Applied On */}
              <div className="text-xs text-slate-400">Applied on: {req.appliedOn}</div>

              {/* Response */}
              {req.response && (
                <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-green-700">
                  💬 <span className="font-semibold">Response:</span> {req.response}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-800">Submit New Request</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Request Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {REQUEST_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your request..."
                    value={form.reason}
                    onChange={(e) => { setForm({ ...form, reason: e.target.value }); setFormError(''); }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                  {formError && <p className="text-xs text-red-600 mt-1">{formError}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={form.fromDate}
                      onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={form.toDate}
                      onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-2"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
