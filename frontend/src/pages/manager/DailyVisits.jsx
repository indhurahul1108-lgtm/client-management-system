import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { SHIFTS } from '../../utils/attendanceUtils.js';
import { Fuel, Calendar, MapPin, CheckCircle, Clock, Plus, X, Users, AlertCircle, Edit2 } from 'lucide-react';

const INITIAL_ROSTER = [
  { id: 'r1', day: 'Monday', date: '2026-10-12', bunkName: 'Indian Oil Petrol Bunk (IOCL) — Anna Salai', shiftId: 'shift_1', shiftName: 'Morning Shift (06:00 AM - 02:00 PM)', staffList: ['Anitha Devi (Operator)', 'Murugan P (Cashier)', 'Deepa S (Attendant)'], requiredCount: 3, deployedCount: 3, status: 'deployed' },
  { id: 'r2', day: 'Monday', date: '2026-10-12', bunkName: 'Bharat Petroleum Pump (BPCL) — Guindy', shiftId: 'shift_2', shiftName: 'Evening Shift (02:00 PM - 10:00 PM)', staffList: ['Ravi Kumar (Operator)', 'Lavanya M (Attendant)'], requiredCount: 2, deployedCount: 2, status: 'deployed' },
  { id: 'r3', day: 'Tuesday', date: '2026-10-13', bunkName: 'HPCL 24/7 Fuel Station — OMR Tech Hub', shiftId: 'shift_3', shiftName: 'Night Shift (10:00 PM - 06:00 AM)', staffList: ['Vijay S (Night Operator)', 'Bala Murugan (Attendant)'], requiredCount: 2, deployedCount: 2, status: 'deployed' },
  { id: 'r4', day: 'Tuesday', date: '2026-10-13', bunkName: 'Shell Petrol Station — Sholinganallur', shiftId: 'shift_1', shiftName: 'Morning Shift (06:00 AM - 02:00 PM)', staffList: ['Kavitha R (Nozzle Attendant)', 'Sundaram V (Cashier)'], requiredCount: 2, deployedCount: 2, status: 'deployed' },
  { id: 'r5', day: 'Wednesday', date: '2026-10-14', bunkName: 'Nayara Energy Fuel Pump — Poonamallee', shiftId: 'shift_2', shiftName: 'Evening Shift (02:00 PM - 10:00 PM)', staffList: ['Anitha Devi (Lead Operator)', 'Ravi Kumar (Attendant)'], requiredCount: 2, deployedCount: 2, status: 'scheduled' },
  { id: 'r6', day: 'Thursday', date: '2026-10-15', bunkName: 'Indian Oil Auto Care — Koyambedu', shiftId: 'shift_1', shiftName: 'Morning Shift (06:00 AM - 02:00 PM)', staffList: ['Deepa S (Operator)', 'Lavanya M (Attendant)'], requiredCount: 2, deployedCount: 2, status: 'scheduled' },
  { id: 'r7', day: 'Friday', date: '2026-10-16', bunkName: 'BPCL Super Station — Tambaram', shiftId: 'shift_3', shiftName: 'Night Shift (10:00 PM - 06:00 AM)', staffList: ['Vijay S (Night Operator)', 'Murugan P (Incharge)'], requiredCount: 2, deployedCount: 2, status: 'scheduled' },
];

export default function DailyVisits() {
  const { user } = useAuth();
  const allBunks = DUMMY_USERS.filter(u => u.role === 'client');
  const allStaff = DUMMY_USERS.filter(u => u.role === 'staff');

  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [selectedDay, setSelectedDay] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    day: 'Monday',
    date: new Date().toISOString().split('T')[0],
    bunkName: allBunks[0]?.name || 'Indian Oil Petrol Bunk',
    shiftId: 'shift_1',
    selectedStaff: ['Anitha Devi (Operator)'],
    requiredCount: 2,
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = () => {
    if (!form.bunkName) { showToast('⚠️ Please select Petrol Bunk'); return; }
    const shiftObj = SHIFTS.find(s => s.id === form.shiftId) || SHIFTS[0];
    const newEntry = {
      id: `r_${Date.now()}`,
      day: form.day,
      date: form.date,
      bunkName: form.bunkName,
      shiftId: form.shiftId,
      shiftName: `${shiftObj.name} (${shiftObj.label})`,
      staffList: form.selectedStaff,
      requiredCount: Number(form.requiredCount),
      deployedCount: form.selectedStaff.length,
      status: 'scheduled',
    };
    setRoster(prev => [newEntry, ...prev]);
    setShowAdd(false);
    showToast('✅ Bunk shift duty allocated successfully!');
  };

  const markComplete = (id) => {
    setRoster(prev => prev.map(r => r.id === id ? { ...r, status: 'deployed' } : r));
    showToast('✅ Shift marked as completed!');
  };

  const filtered = selectedDay === 'all'
    ? roster
    : roster.filter(r => r.day === selectedDay || r.shiftId === selectedDay);

  return (
    <DashboardLayout title="Petrol Bunk Duty Roster">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-purple-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Top Banner with Petrol Bunk Context */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-6 text-white mb-6 shadow-xl border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-orange-500 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Fuel size={13} /> ELAKIYAA Manpower Supply
              </span>
              <span className="text-xs text-purple-200">24/7 Bunk Coverage</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">Petrol Bunk Daily Duty Roster</h1>
            <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
              Track which fuel attendant & cashier is deployed at which petrol bunk today. Manage 3 shifts (Morning, Evening, Night) and reassign staff as needed.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow transition"
          >
            <Plus size={16} /> Allocate Bunk Shift
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
            {day === 'all' ? 'All Bunks & Days' : day}
          </button>
        ))}
      </div>

      {/* Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition hover:border-purple-200 flex flex-col justify-between">
            <div>
              {/* Day & Shift Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Calendar size={13} className="text-purple-600" /> {item.day}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold capitalize ${item.status === 'deployed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status === 'deployed' ? '✓ On Duty' : 'Scheduled'}
                </span>
              </div>

              {/* Petrol Bunk Name */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl mt-0.5 shrink-0">
                  <Fuel size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.bunkName}</h3>
                  <p className="text-xs font-semibold text-purple-700 mt-1 flex items-center gap-1">
                    <Clock size={11} /> {item.shiftName}
                  </p>
                </div>
              </div>

              {/* Staff Deployed at this Bunk */}
              <div className="bg-slate-50 rounded-xl p-3.5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bunk Staff Deployed</span>
                  <span className="text-xs font-bold text-green-700">{item.deployedCount} / {item.requiredCount} Present</span>
                </div>
                <div className="space-y-1">
                  {item.staffList.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-1.5 rounded-lg border border-slate-100 font-medium">
                      <span className="text-blue-500 text-xs">👤</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-slate-50 flex gap-2">
              {item.status !== 'deployed' ? (
                <button
                  onClick={() => markComplete(item.id)}
                  className="w-full py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={13} /> Confirm Bunk Duty
                </button>
              ) : (
                <span className="w-full py-2 text-center text-xs text-green-600 font-bold bg-green-50/50 rounded-xl">
                  ✓ Staff Working at Bunk
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Bunk Shift Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Allocate Staff to Petrol Bunk</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Select Petrol Bunk *</label>
                <select
                  value={form.bunkName}
                  onChange={e => setForm({ ...form, bunkName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50"
                >
                  {allBunks.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Day of Week</label>
                  <select
                    value={form.day}
                    onChange={e => setForm({ ...form, day: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Shift Time *</label>
                  <select
                    value={form.shiftId}
                    onChange={e => setForm({ ...form, shiftId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  >
                    {SHIFTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.start}-{s.end})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Select Bunk Attendants (Staff)</label>
                <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1 text-xs">
                  {allStaff.map(s => {
                    const label = `${s.name} (${s.designation || 'Attendant'})`;
                    const isChecked = form.selectedStaff.includes(label);
                    return (
                      <label key={s.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setForm(prev => {
                              const list = prev.selectedStaff.includes(label)
                                ? prev.selectedStaff.filter(x => x !== label)
                                : [...prev.selectedStaff, label];
                              return { ...prev, selectedStaff: list };
                            });
                          }}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-slate-700 font-medium">{s.name}</span>
                        <span className="text-slate-400 text-[10px]">({s.staffId})</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{form.selectedStaff.length} staff selected</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold">Save Allocation</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
