import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { DollarSign } from 'lucide-react';

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {status}
    </span>
  );
}

export default function SalaryAdmin() {
  const [filter, setFilter] = useState('all');
  const [salaries, setSalaries] = useState(DUMMY_SALARIES);

  const markPaid = (id) => {
    setSalaries(prev => prev.map(s => s.id === id
      ? { ...s, status: 'paid', paidOn: new Date().toISOString().split('T')[0] }
      : s
    ));
  };

  const filtered = filter === 'all' ? salaries : salaries.filter(s => s.status === filter);

  const totalPaid    = salaries.filter(s => s.status === 'paid').reduce((a, s) => a + s.net, 0);
  const totalPending = salaries.filter(s => s.status === 'pending').reduce((a, s) => a + s.net, 0);

  return (
    <DashboardLayout title="Salary Management">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-xs text-green-600 font-medium mb-1">Paid Count</p>
          <p className="text-2xl font-bold text-green-800">{salaries.filter(s => s.status === 'paid').length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
          <p className="text-xs text-yellow-600 font-medium mb-1">Pending Count</p>
          <p className="text-2xl font-bold text-yellow-800">{salaries.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-xs text-blue-600 font-medium mb-1">Total Paid</p>
          <p className="text-xl font-bold text-blue-800">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
          <p className="text-xs text-orange-600 font-medium mb-1">Total Pending</p>
          <p className="text-xl font-bold text-orange-800">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          {['all', 'paid', 'pending'].map(f => (
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Basic</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Allowance</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Deduction</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Paid On</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">{s.staffName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{s.month}</td>
                  <td className="px-4 py-4 text-right text-slate-500">₹{s.basic.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-right text-green-600">+₹{s.allowance.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-right text-red-500">-₹{s.deduction.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">₹{s.net.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-slate-400 text-xs">{s.paidOn || '—'}</td>
                  <td className="px-4 py-4"><Badge status={s.status} /></td>
                  <td className="px-4 py-4">
                    {s.status === 'pending' ? (
                      <button onClick={() => markPaid(s.id)}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200 transition whitespace-nowrap">
                        Mark Paid
                      </button>
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
          <div className="text-center py-12 text-slate-400 text-sm">No salary records found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
