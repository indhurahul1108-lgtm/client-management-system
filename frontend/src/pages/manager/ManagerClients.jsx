import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Search, X, Fuel, MapPin, Calendar, Clock, IndianRupee, Users } from 'lucide-react';

export default function ManagerClients() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === mId);
  const myStaffIds = myStaff.map(s => s.staffId);
  const allBunks = DUMMY_USERS.filter(u => u.role === 'client');

  const [search, setSearch] = useState('');
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [modalTab, setModalTab] = useState('attendance');

  const filtered = allBunks.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.mobile || '').includes(search) ||
    (c.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Petrol Bunk Clients">
      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-800">{allBunks.length}</p>
          <p className="text-xs text-slate-500 mt-1">Petrol Bunk Stations</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-800">24/7 Bunk Coverage</p>
          <p className="text-xs text-slate-500 mt-1">3 Operational Shifts</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-800">{myStaff.length} Attendants</p>
          <p className="text-xs text-slate-500 mt-1">Managed Crew</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search petrol bunks by name, location, or mobile..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
      </div>

      {/* Petrol Bunks Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(bunk => (
          <div
            key={bunk.id}
            onClick={() => { setSelectedBunk(bunk); setModalTab('attendance'); }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition hover:border-purple-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                <Fuel size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{bunk.name}</p>
                <p className="text-xs text-purple-700 font-semibold">{bunk.service}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${bunk.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {bunk.status}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 mb-3 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin size={12} /> {bunk.address}
              </span>
              <span className="font-mono text-purple-700 font-bold">{bunk.mobile}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Deployed Staff: <strong className="text-slate-700">4 Attendants</strong></span>
              <span className="text-purple-600 font-bold hover:underline">View 3-Month Log →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3-MONTH DETAILS MODAL (Bunk Click) ───────────────── */}
      {selectedBunk && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedBunk(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Fuel size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedBunk.name}</h3>
                  <p className="text-xs text-purple-200">{selectedBunk.address} · 📞 {selectedBunk.mobile}</p>
                  <p className="text-[11px] text-orange-300 font-medium mt-0.5">{selectedBunk.service}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBunk(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 overflow-x-auto bg-slate-50">
              {[
                { id: 'attendance', label: '📅 3-Month Staff Attendance' },
                { id: 'billing', label: '💰 3-Month Salary & Bunk Billing' },
                { id: 'staff', label: '⛽ Deployed Crew (3 Shifts)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-t-xl transition ${modalTab === t.id ? 'bg-white text-purple-700 shadow-sm border-t border-x border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[55vh]">
              {modalTab === 'attendance' && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <p className="text-slate-500">Staff attendance log at <span className="font-bold text-slate-700">{selectedBunk.name}</span>:</p>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">3 Shifts Active</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Staff Name</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Shift</th>
                        <th className="p-2 text-left">Punch In</th>
                        <th className="p-2 text-left">Punch Out</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Anitha Devi', date: '2026-10-10', shift: 'Morning Shift', in: '05:55 AM', out: '02:05 PM', status: 'present' },
                        { name: 'Murugan P', date: '2026-10-10', shift: 'Evening Shift', in: '02:00 PM', out: '10:00 PM', status: 'present' },
                        { name: 'Vijay S', date: '2026-10-09', shift: 'Night Shift', in: '10:00 PM', out: '06:05 AM', status: 'present' },
                        { name: 'Deepa S', date: '2026-10-09', shift: 'Morning Shift', in: '06:15 AM', out: '02:00 PM', status: 'late' },
                        { name: 'Ravi Kumar', date: '2026-10-08', shift: 'Evening Shift', in: '01:58 PM', out: '10:02 PM', status: 'present' },
                        { name: 'Lavanya M', date: '2026-10-07', shift: 'Morning Shift', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                      ].map((a, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-800">{a.name}</td>
                          <td className="p-2 text-slate-500 font-mono">{a.date}</td>
                          <td className="p-2 text-purple-700 font-medium">{a.shift}</td>
                          <td className="p-2 font-mono text-slate-700">{a.in}</td>
                          <td className="p-2 font-mono text-slate-500">{a.out}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {modalTab === 'billing' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">3-Month Staff Salary Payout & Bunk Manpower Billing:</p>
                  <div className="space-y-3">
                    {[
                      { month: 'October 2026', staffCount: 5, dutyDays: 28, totalSalary: 135000, agencyBill: 162000, status: 'Active (Current)' },
                      { month: 'September 2026', staffCount: 5, dutyDays: 30, totalSalary: 142000, agencyBill: 170400, status: 'Paid & Cleared' },
                      { month: 'August 2026', staffCount: 4, dutyDays: 31, totalSalary: 118000, agencyBill: 141600, status: 'Paid & Cleared' },
                    ].map((m, i) => (
                      <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{m.month}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {m.staffCount} Deployed Staff · {m.dutyDays} Operating Days · Total Salary Paid: <span className="font-mono font-bold text-slate-700">₹{m.totalSalary.toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-purple-700 font-mono">Bunk Bill: ₹{m.agencyBill.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-0.5">{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'staff' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Staff Currently Deployed at this Petrol Bunk:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Anitha Devi', role: 'Lead Fuel Operator', shift: 'Morning (06:00 AM - 02:00 PM)', phone: '9000000004' },
                      { name: 'Murugan P', role: 'Cashier & Accounts', shift: 'Evening (02:00 PM - 10:00 PM)', phone: '9000000005' },
                      { name: 'Vijay S', role: 'Night Attendant', shift: 'Night (10:00 PM - 06:00 AM)', phone: '9000000011' },
                      { name: 'Deepa S', role: 'Nozzle Attendant', shift: 'Morning (06:00 AM - 02:00 PM)', phone: '9000000006' },
                    ].map((st, i) => (
                      <div key={i} className="p-3 border border-slate-200 rounded-xl bg-purple-50/20">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">⛽</span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{st.name}</p>
                            <p className="text-[11px] text-slate-500">{st.role}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-purple-700 font-semibold mt-2">Shift: {st.shift}</p>
                        <p className="text-[10px] text-slate-400 font-mono">📞 {st.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
