import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { IndianRupee, CreditCard, Smartphone, Check, Edit2, X, Plus, User, Building2, Search, Printer } from 'lucide-react';
import { printIndividualRecord } from '../../utils/printUtils.js';

const PAYMENT_METHODS = [
  { id: 'gpay',   label: 'GPay',          icon: '📲', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'bank',   label: 'Bank Transfer', icon: '🏦', color: 'bg-green-50 border-green-200 text-green-700' },
  { id: 'credit', label: 'Credit Card',   icon: '💳', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { id: 'cash',   label: 'Cash',          icon: '💵', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
];

function Toast({ msg, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-bounce">
      {msg}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

export default function SalaryAdmin() {
  // Combine Staff & Deployed Candidates into a comprehensive salary list
  const clientCandidates = DUMMY_USERS.filter(u => u.role === 'client');
  const candidateSalaries = clientCandidates.map((c, idx) => ({
    id: `csal_${c.id}`,
    staffId: c.id,
    staffName: c.name,
    userRole: 'client',
    roleTag: c.roleAtBunk || 'Fuel Attendant',
    assignedBunk: c.assignedBunk || 'Petrol Bunk',
    month: 'October 2026',
    basic: (c.salary || 18500) - 2500,
    allowance: 2500,
    deduction: 0,
    netSalary: c.salary || 18500,
    status: idx % 2 === 0 ? 'paid' : 'pending',
    paidOn: idx % 2 === 0 ? '2026-10-05' : null,
    paymentMethod: idx % 2 === 0 ? 'gpay' : 'bank',
  }));

  const staffSalariesFormatted = DUMMY_SALARIES.map(s => {
    const userObj = DUMMY_USERS.find(u => u.id === s.staffId);
    return {
      ...s,
      userRole: 'staff',
      roleTag: 'Field Staff',
      assignedBunk: 'Assigned Bunks',
      paymentMethod: s.status === 'paid' ? 'bank' : 'gpay',
      netSalary: s.net || (s.basic + s.allowance - s.deduction),
    };
  });

  const [salaries, setSalaries] = useState([...staffSalariesFormatted, ...candidateSalaries]);
  const [payModal, setPayModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [setNewSalaryModal, setSetNewSalaryModal] = useState(false);
  const [newSalaryData, setNewSalaryData] = useState({
    userId: clientCandidates[0]?.id || '',
    basic: 16000,
    allowance: 2500,
    deduction: 0,
    month: 'October 2026',
  });
  const [toast, setToast] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all | staff | client
  const [filterStatus, setFilterStatus] = useState('all'); // all | pending | paid
  const [search, setSearch] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openPay = (s) => setPayModal({ salary: s, method: s.paymentMethod || 'gpay' });

  const confirmPay = () => {
    setSalaries(prev => prev.map(s => s.id === payModal.salary.id
      ? { ...s, status: 'paid', paidOn: new Date().toISOString().split('T')[0], paymentMethod: payModal.method }
      : s
    ));
    setPayModal(null);
    const pm = PAYMENT_METHODS.find(p => p.id === payModal.method);
    showToast(`✅ ${payModal.salary.staffName} salary paid via ${pm?.label}!`);
  };

  const openEdit = (s) => setEditModal({ ...s });
  const saveEdit = () => {
    const net = Number(editModal.basic) + Number(editModal.allowance) - Number(editModal.deduction);
    setSalaries(prev => prev.map(s => s.id === editModal.id ? { ...editModal, netSalary: net } : s));
    setEditModal(null);
    showToast(`✅ ${editModal.staffName} salary updated! (₹${net.toLocaleString('en-IN')})`);
  };

  const handleCreateNewSalary = () => {
    const userObj = DUMMY_USERS.find(u => u.id === newSalaryData.userId);
    if (!userObj) return;
    const net = Number(newSalaryData.basic) + Number(newSalaryData.allowance) - Number(newSalaryData.deduction);
    const newEntry = {
      id: `sal_${Date.now()}`,
      staffId: userObj.id,
      staffName: userObj.name,
      userRole: userObj.role,
      roleTag: userObj.roleAtBunk || (userObj.role === 'staff' ? 'Staff' : 'Worker'),
      assignedBunk: userObj.assignedBunk || 'Petrol Bunk',
      month: newSalaryData.month,
      basic: Number(newSalaryData.basic),
      allowance: Number(newSalaryData.allowance),
      deduction: Number(newSalaryData.deduction),
      netSalary: net,
      status: 'pending',
      paidOn: null,
      paymentMethod: 'gpay',
    };
    setSalaries(prev => [newEntry, ...prev]);
    setSetNewSalaryModal(false);
    showToast(`✅ New salary of ₹${net.toLocaleString('en-IN')} allocated for ${userObj.name}!`);
  };

  const filtered = salaries.filter(s => {
    const matchRole = filterRole === 'all' || s.userRole === filterRole;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchSearch = s.staffName.toLowerCase().includes(search.toLowerCase()) || 
      (s.assignedBunk || '').toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const totalPaid = salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const totalPending = salaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const clientSalaryTotal = salaries.filter(s => s.userRole === 'client').reduce((sum, s) => sum + (s.netSalary || 0), 0);

  return (
    <DashboardLayout title="Salary Management">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 mb-6 shadow-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <IndianRupee size={20} className="text-amber-400" />
            Admin Salary Setting & Payouts (Staff & Bunk Candidates)
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Management sets individual salary amounts for deployed manpower & staff with instant payment modes (GPay / Bank Transfer).
          </p>
        </div>
        <button
          onClick={() => setSetNewSalaryModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition shrink-0"
        >
          <Plus size={16} /> Set Worker Salary
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Paid', salaries.filter(s => s.status === 'paid').length, `₹${totalPaid.toLocaleString('en-IN')}`, 'emerald'],
          ['Pending Payout', salaries.filter(s => s.status === 'pending').length, `₹${totalPending.toLocaleString('en-IN')}`, 'amber'],
          ['Deployed Crew Salaries', salaries.filter(s => s.userRole === 'client').length, `₹${clientSalaryTotal.toLocaleString('en-IN')}`, 'orange'],
          ['GPay Payment Mode', salaries.filter(s => s.paymentMethod === 'gpay').length, 'GPay / Bank', 'blue'],
        ].map(([label, count, sub, c]) => (
          <div key={label} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 shadow-sm`}>
            <p className={`text-2xl font-bold text-${c}-700`}>{count}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
            <p className={`text-xs text-${c}-700 font-bold mt-1`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by worker name, bunk..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              ['all', 'All Roles'],
              ['client', 'Bunk Candidates'],
              ['staff', 'Field Staff'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterRole(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterRole === val ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              ['all', 'All Status'],
              ['pending', 'Pending'],
              ['paid', 'Paid'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterStatus(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterStatus === val ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                {[
                  'Worker / Staff Name',
                  'Role & Category',
                  'Assigned Bunk',
                  'Month',
                  'Basic',
                  'Allowance',
                  'Deduction',
                  'Net Salary',
                  'Payment Mode',
                  'Status',
                  'Actions'
                ].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs text-slate-400 font-bold uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => {
                const pm = PAYMENT_METHODS.find(p => p.id === s.paymentMethod) || PAYMENT_METHODS[0];
                return (
                  <tr key={s.id} className={`hover:bg-slate-50 transition ${s.status === 'paid' ? '' : 'bg-amber-50/20'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${s.userRole === 'client' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {s.staffName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{s.staffName}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${s.userRole === 'client' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                            {s.userRole === 'client' ? 'Manpower Worker' : 'Staff'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-medium whitespace-nowrap">
                      {s.roleTag}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[180px] truncate" title={s.assignedBunk}>
                      {s.assignedBunk}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{s.month}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-700">₹{s.basic?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono text-emerald-600 font-semibold">+₹{s.allowance?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono text-red-500 font-semibold">-₹{s.deduction?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono font-black text-slate-900 whitespace-nowrap">
                      ₹{s.netSalary?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 w-fit ${pm.color}`}>
                        <span>{pm.icon}</span> {pm.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${s.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {s.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      {s.paidOn && <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{s.paidOn}</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        {s.status === 'pending' && (
                          <button
                            onClick={() => openPay(s)}
                            className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
                          >
                            <IndianRupee size={12} /> Pay Now
                          </button>
                        )}
                        <button
                          onClick={() => printIndividualRecord({
                            title: `Official Salary Statement & Payslip (${s.month})`,
                            person: {
                              name: s.staffName,
                              staffId: s.staffId,
                              mobile: '—',
                              role: s.userRole === 'client' ? 'Client Candidate' : 'Staff Member',
                              roleAtBunk: s.roleTag,
                              assignedBunk: s.assignedBunk,
                              salary: s.netSalary,
                            },
                            type: 'salary',
                            records: [s],
                          })}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100"
                          title="Print Individual Payslip"
                        >
                          <Printer size={12} /> Payslip
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-200"
                        >
                          <Edit2 size={12} /> Set/Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Payment Method Modal (GPay / Bank / Card) ── */}
      {payModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Pay Salary
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {payModal.salary.staffName} — {payModal.salary.month} —
              <span className="font-bold text-slate-800 ml-1">
                ₹{payModal.salary.netSalary?.toLocaleString('en-IN')}
              </span>
            </p>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Select Payment Mode
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setPayModal(p => ({ ...p, method: pm.id }))}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border-2 text-xs font-bold transition ${payModal.method === pm.id ? pm.color + ' border-current shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                  <span className="text-xl">{pm.icon}</span> {pm.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold">
                Cancel
              </button>
              <button onClick={confirmPay} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-md">
                <Check size={14} /> Confirm Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / Set Salary Modal ── */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Set / Edit Salary
                </h3>
                <p className="text-xs text-slate-400">{editModal.staffName} ({editModal.roleTag})</p>
              </div>
              <button onClick={() => setEditModal(null)}><X size={18} className="text-slate-400" /></button>
            </div>

            {[['Basic Pay', 'basic'], ['Shift Allowance', 'allowance'], ['Deduction', 'deduction']].map(([label, key]) => (
              <div key={key} className="mb-3">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">{label}</label>
                <input
                  type="number"
                  value={editModal[key]}
                  onChange={e => setEditModal(p => ({ ...p, [key]: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 mb-5 text-center">
              <p className="text-xs text-blue-600 font-semibold">Calculated Net Salary</p>
              <p className="text-2xl font-black text-blue-900 mt-0.5">
                ₹{(Number(editModal.basic) + Number(editModal.allowance) - Number(editModal.deduction)).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold">
                Cancel
              </button>
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-md">
                Save Salary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Set New Worker Salary Modal ── */}
      {setNewSalaryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Set New Worker Salary
                </h3>
                <p className="text-xs text-slate-400">Add monthly payout for candidate or staff</p>
              </div>
              <button onClick={() => setSetNewSalaryModal(false)}><X size={18} className="text-slate-400" /></button>
            </div>

            <div className="mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                Select Worker / Candidate
              </label>
              <select
                value={newSalaryData.userId}
                onChange={e => setNewSalaryData(p => ({ ...p, userId: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
              >
                {DUMMY_USERS.filter(u => u.role === 'client' || u.role === 'staff').map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role === 'client' ? `Worker (${u.assignedBunk || 'Petrol Bunk'})` : 'Staff'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Basic (₹)</label>
                <input
                  type="number"
                  value={newSalaryData.basic}
                  onChange={e => setNewSalaryData(p => ({ ...p, basic: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Allowance (₹)</label>
                <input
                  type="number"
                  value={newSalaryData.allowance}
                  onChange={e => setNewSalaryData(p => ({ ...p, allowance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-3.5 mb-5 text-center">
              <p className="text-xs text-amber-700 font-semibold">Net Payable</p>
              <p className="text-2xl font-black text-amber-900 mt-0.5">
                ₹{(Number(newSalaryData.basic) + Number(newSalaryData.allowance) - Number(newSalaryData.deduction)).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSetNewSalaryModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateNewSalary} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-md">
                Save & Allocate
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
