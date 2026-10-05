import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { DollarSign, TrendingUp } from 'lucide-react';

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {status}
    </span>
  );
}

export default function StaffSalary() {
  const { user } = useAuth();
  const mySalaries = DUMMY_SALARIES.filter(s => s.staffId === user?.id);
  const latest = mySalaries[mySalaries.length - 1];

  return (
    <DashboardLayout title="My Salary">
      {/* Latest salary card */}
      {latest && (
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-200 text-sm">Latest Month</p>
              <h2 className="text-xl font-bold mt-0.5">{latest.month}</h2>
            </div>
            <Badge status={latest.status} />
          </div>
          <p className="text-4xl font-bold">₹{latest.net.toLocaleString('en-IN')}</p>
          <p className="text-green-200 text-sm mt-1">Net Salary</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-lg font-bold">₹{latest.basic.toLocaleString('en-IN')}</p>
              <p className="text-green-200 text-xs mt-0.5">Basic</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-lg font-bold">₹{latest.allowance.toLocaleString('en-IN')}</p>
              <p className="text-green-200 text-xs mt-0.5">Allowance</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-red-300">-₹{latest.deduction.toLocaleString('en-IN')}</p>
              <p className="text-green-200 text-xs mt-0.5">Deduction</p>
            </div>
          </div>
        </div>
      )}

      {/* Salary history */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Salary History</h2>
        </div>
        {mySalaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Basic</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Allowance</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Deduction</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mySalaries.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-700">{s.month}</td>
                    <td className="px-4 py-3 text-right text-slate-500">₹{s.basic.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-green-600">+₹{s.allowance.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-red-500">-₹{s.deduction.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">₹{s.net.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><Badge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">No salary records found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
