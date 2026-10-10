import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { IndianRupee, CreditCard, Smartphone, Check, Edit2, X } from 'lucide-react';

const PAYMENT_METHODS = [
  { id:'gpay',   label:'GPay',          icon:'📲', color:'bg-blue-50 border-blue-200 text-blue-700' },
  { id:'credit', label:'Credit Card',   icon:'💳', color:'bg-purple-50 border-purple-200 text-purple-700' },
  { id:'bank',   label:'Bank Transfer', icon:'🏦', color:'bg-green-50 border-green-200 text-green-700' },
  { id:'cash',   label:'Cash',          icon:'💵', color:'bg-yellow-50 border-yellow-200 text-yellow-700' },
];

function Toast({ msg, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold">
      {msg}<button onClick={onClose}><X size={14}/></button>
    </div>
  );
}

export default function SalaryAdmin() {
  const [salaries, setSalaries] = useState(
    DUMMY_SALARIES.map(s => ({ ...s, paymentMethod: 'bank' }))
  );
  const [payModal, setPayModal] = useState(null); // { salary, method }
  const [editModal, setEditModal] = useState(null);
  const [toast, setToast] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openPay = (s) => setPayModal({ salary: s, method: s.paymentMethod || 'bank' });

  const confirmPay = () => {
    setSalaries(prev => prev.map(s => s.id === payModal.salary.id
      ? { ...s, status: 'paid', paidOn: new Date().toISOString().split('T')[0], paymentMethod: payModal.method }
      : s
    ));
    setPayModal(null);
    const pm = PAYMENT_METHODS.find(p => p.id === payModal.method);
    showToast(`✅ Salary paid via ${pm?.label}!`);
  };

  const openEdit = (s) => setEditModal({ ...s });
  const saveEdit = () => {
    setSalaries(prev => prev.map(s => s.id === editModal.id ? { ...editModal } : s));
    setEditModal(null);
    showToast('✅ Salary updated!');
  };

  const filtered = filterStatus === 'all' ? salaries : salaries.filter(s => s.status === filterStatus);

  const totalPaid    = salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.netSalary || s.basic + s.allowance - s.deduction), 0);
  const totalPending = salaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.netSalary || s.basic + s.allowance - s.deduction), 0);

  return (
    <DashboardLayout title="Salary Management">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Paid',    salaries.filter(s=>s.status==='paid').length,    `₹${totalPaid.toLocaleString('en-IN')}`,    'green'],
          ['Pending',       salaries.filter(s=>s.status==='pending').length, `₹${totalPending.toLocaleString('en-IN')}`, 'yellow'],
          ['GPay Paid',     salaries.filter(s=>s.paymentMethod==='gpay'&&s.status==='paid').length, 'GPay', 'blue'],
          ['Bank Transfer', salaries.filter(s=>s.paymentMethod==='bank'&&s.status==='paid').length, 'Bank', 'purple'],
        ].map(([label, count, sub, c]) => (
          <div key={label} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4`}>
            <p className={`text-2xl font-bold text-${c}-700`}>{count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            <p className={`text-xs text-${c}-600 font-semibold mt-1`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['all','pending','paid'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${filterStatus===f?'bg-blue-700 text-white':'bg-white text-slate-600 border border-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Staff','Month','Basic','Allowance','Deduction','Net Salary','Payment','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => {
                const net = s.netSalary || (s.basic + s.allowance - s.deduction);
                const pm  = PAYMENT_METHODS.find(p => p.id === s.paymentMethod);
                return (
                  <tr key={s.id} className={`hover:bg-slate-50 transition ${s.status==='paid'?'':'bg-yellow-50/20'}`}>
                    <td className="px-4 py-3 font-semibold text-slate-700 text-xs">{s.staffName}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.month}</td>
                    <td className="px-4 py-3 text-xs font-mono">₹{s.basic?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono text-green-600">+₹{s.allowance?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono text-red-500">-₹{s.deduction?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-slate-800">₹{net.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {s.status === 'paid' ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${pm?.color||'bg-slate-100 text-slate-600'}`}>
                          {pm?.icon} {pm?.label}
                        </span>
                      ) : <span className="text-xs text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${s.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                        {s.status}
                      </span>
                      {s.paidOn && <p className="text-xs text-slate-400 mt-0.5">{s.paidOn}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {s.status === 'pending' && (
                          <button onClick={() => openPay(s)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700">
                            <IndianRupee size={11}/> Pay
                          </button>
                        )}
                        <button onClick={() => openEdit(s)}
                          className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200">
                          <Edit2 size={11}/> Edit
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

      {/* Payment Method Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 mb-1">Pay Salary</h3>
            <p className="text-xs text-slate-400 mb-4">
              {payModal.salary.staffName} — {payModal.salary.month} —
              <span className="font-bold text-slate-700 ml-1">
                ₹{(payModal.salary.netSalary || payModal.salary.basic + payModal.salary.allowance - payModal.salary.deduction).toLocaleString('en-IN')}
              </span>
            </p>

            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {PAYMENT_METHODS.map(pm => (
                <button key={pm.id} onClick={() => setPayModal(p => ({ ...p, method: pm.id }))}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition ${payModal.method === pm.id ? pm.color + ' border-current' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span className="text-xl">{pm.icon}</span> {pm.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={confirmPay} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                <Check size={14}/> Confirm Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Salary Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Edit Salary — {editModal.staffName}</h3>
              <button onClick={() => setEditModal(null)}><X size={18} className="text-slate-400"/></button>
            </div>
            {[['Basic (₹)', 'basic'], ['Allowance (₹)', 'allowance'], ['Deduction (₹)', 'deduction']].map(([label, key]) => (
              <div key={key} className="mb-3">
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">{label}</label>
                <input type="number" value={editModal[key]} onChange={e => setEditModal(p => ({ ...p, [key]: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-center">
              <p className="text-xs text-slate-400">Net Salary</p>
              <p className="text-xl font-bold text-blue-700">₹{(editModal.basic + editModal.allowance - editModal.deduction).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-800">Save</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
