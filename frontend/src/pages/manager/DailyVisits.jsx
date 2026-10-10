import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Building2, Calendar, MapPin, CheckCircle, Clock, Plus, X, Users, Briefcase } from 'lucide-react';

const INITIAL_SCHEDULE = [
  { id: 'v1', day: 'Monday', date: '2026-10-12', bank: 'State Bank of India — Commercial Hub', branch: 'Anna Salai, Chennai', purpose: 'Bulk Document Verification & Tax Audit', targetVolume: '350 Corporate Files', staffAssigned: 'Anitha Devi, Murugan P', status: 'completed' },
  { id: 'v2', day: 'Tuesday', date: '2026-10-13', bank: 'HDFC Bank — Corporate Branch', branch: 'Nungambakkam, Chennai', purpose: 'Bulk KYC & Statutory Compliance Review', targetVolume: '280 Accounts', staffAssigned: 'Deepa S, Ravi Kumar', status: 'completed' },
  { id: 'v3', day: 'Wednesday', date: '2026-10-14', bank: 'ICICI Bank — SME Hub', branch: 'Guindy Industrial Estate', purpose: 'Q2 GST & Financial Reconciliation', targetVolume: '420 Client Entries', staffAssigned: 'Lavanya M, Vijay S', status: 'in_progress' },
  { id: 'v4', day: 'Thursday', date: '2026-10-15', bank: 'Axis Bank — Tech Park Branch', branch: 'OMR, Chennai', purpose: 'Export Accounts Clearance & Verification', targetVolume: '190 Files', staffAssigned: 'Bala Murugan, Kavitha R', status: 'scheduled' },
  { id: 'v5', day: 'Friday', date: '2026-10-16', bank: 'Canara Bank — Regional Office', branch: 'T.Nagar, Chennai', purpose: 'Annual Audit & Tax Filing Documentation', targetVolume: '310 Accounts', staffAssigned: 'Sundaram V, Murugan P', status: 'scheduled' },
  { id: 'v6', day: 'Saturday', date: '2026-10-17', bank: 'Indian Bank — Main Corporate Branch', branch: 'Harbour, Chennai', purpose: 'Weekly Bulk Finalization & Reports', targetVolume: '500 Records', staffAssigned: 'Anitha Devi, Deepa S', status: 'scheduled' },
];

export default function DailyVisits() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    day: 'Monday', date: '', bank: '', branch: '', purpose: '', targetVolume: '', staffAssigned: 'Anitha Devi'
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = () => {
    if (!form.bank || !form.branch || !form.purpose) { showToast('⚠️ Please fill required fields'); return; }
    const newVisit = {
      id: `v_${Date.now()}`,
      ...form,
      status: 'scheduled'
    };
    setSchedule(prev => [...prev, newVisit]);
    setShowAdd(false);
    showToast('✅ Bank visit scheduled successfully!');
  };

  const markComplete = (id) => {
    setSchedule(prev => prev.map(v => v.id === id ? { ...v, status: 'completed' } : v));
    showToast('✅ Visit marked as completed!');
  };

  const filtered = selectedDay === 'all' ? schedule : schedule.filter(s => s.day === selectedDay || s.status === selectedDay);

  return (
    <DashboardLayout title="Daily Bank & Branch Visits">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-purple-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 text-white mb-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bulk Project Management</span>
            <h1 className="text-2xl font-bold mt-2">Daily Bank Visit Schedule</h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              Organized daily schedule showing which bank branch the team visits each day for bulk client file verification, statutory audits, and corporate clearances.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-white text-purple-800 hover:bg-purple-50 font-bold px-4 py-2.5 rounded-xl text-sm shadow transition"
          >
            <Plus size={16} /> Schedule Bank Visit
          </button>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedDay === day ? 'bg-purple-700 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {day === 'all' ? 'All Days' : day}
          </button>
        ))}
      </div>

      {/* Visits Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition hover:border-purple-200 flex flex-col justify-between">
            <div>
              {/* Day & Status Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Calendar size={13} /> {item.day} {item.date && `(${item.date})`}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold capitalize ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status === 'in_progress' ? 'In Progress' : item.status}
                </span>
              </div>

              {/* Bank Name */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl mt-0.5 shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.bank}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {item.branch}
                  </p>
                </div>
              </div>

              {/* Scope & Target */}
              <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Purpose / Task:</span>
                  <span className="font-medium text-slate-700">{item.purpose}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 text-[11px]">Target Volume:</span>
                  <span className="font-bold text-purple-800">{item.targetVolume}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Staff Deployed:</span>
                  <span className="font-semibold text-slate-700">{item.staffAssigned}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-50 flex gap-2">
              {item.status !== 'completed' ? (
                <button
                  onClick={() => markComplete(item.id)}
                  className="w-full py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={13} /> Mark Done
                </button>
              ) : (
                <span className="w-full py-2 text-center text-xs text-green-600 font-bold bg-green-50/50 rounded-xl">
                  ✓ Visit Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Visit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Schedule Bank Visit</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Day of Week</label>
                  <select
                    value={form.day}
                    onChange={e => setForm({ ...form, day: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs bg-slate-50"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Bank Name *</label>
                <input
                  value={form.bank}
                  onChange={e => setForm({ ...form, bank: e.target.value })}
                  placeholder="e.g. State Bank of India — Corporate Hub"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Branch / Location *</label>
                <input
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  placeholder="e.g. Anna Salai, Chennai"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Purpose / Task *</label>
                <input
                  value={form.purpose}
                  onChange={e => setForm({ ...form, purpose: e.target.value })}
                  placeholder="e.g. Bulk Document Clearance"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Target Volume</label>
                  <input
                    value={form.targetVolume}
                    onChange={e => setForm({ ...form, targetVolume: e.target.value })}
                    placeholder="e.g. 250 Accounts"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Staff Assigned</label>
                  <input
                    value={form.staffAssigned}
                    onChange={e => setForm({ ...form, staffAssigned: e.target.value })}
                    placeholder="Staff names"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800">Add Schedule</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
