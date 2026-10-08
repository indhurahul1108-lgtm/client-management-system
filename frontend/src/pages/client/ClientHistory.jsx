import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getClientData, calcOverdueDays } from '../../data/clientData.js';
import { DUMMY_USERS } from '../../data/dummyData.jsx';

const STATUS_COLOR = {
  in_progress: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  on_hold: 'bg-slate-100 text-slate-600',
};
const STATUS_LABEL = {
  in_progress: 'In Progress',
  pending: 'Pending',
  completed: 'Completed',
  overdue: 'Overdue',
  on_hold: 'On Hold',
};

const FILTERS = ['All', 'Completed', 'Overdue', 'Pending'];

export default function ClientHistory() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');
  const works = data.works;

  const [activeFilter, setActiveFilter] = useState('All');

  const getStaff = (staffId) => DUMMY_USERS.find((u) => u.staffId === staffId);

  const filtered = works.filter((w) => {
    if (activeFilter === 'All') return true;
    return w.status === activeFilter.toLowerCase();
  });

  const stats = [
    { label: 'Total', value: works.length, color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { label: 'Completed', value: works.filter((w) => w.status === 'completed').length, color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Overdue', value: works.filter((w) => w.status === 'overdue').length, color: 'bg-red-50 border-red-200 text-red-700' },
  ];

  const getRowBg = (status) => {
    if (status === 'completed') return 'bg-green-50';
    if (status === 'overdue') return 'bg-red-50';
    return 'bg-white';
  };

  return (
    <DashboardLayout title="Work History">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 flex flex-col items-center ${s.color}`}>
            <span className="text-3xl font-bold">{s.value}</span>
            <span className="text-sm font-medium mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters + Print */}
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
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition-colors min-h-[44px] text-sm"
        >
          🖨️ Export / Print
        </button>
      </div>

      {/* Responsive Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-lg font-medium">No records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Work ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Start Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Due Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Staff</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((work) => {
                  const staff = getStaff(work.staffId);
                  const overdue = work.status !== 'completed' && calcOverdueDays(work.dueDate) > 0;
                  return (
                    <tr key={work.id} className={`hover:brightness-95 transition-all ${getRowBg(work.status)}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                          {work.workId}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 min-w-[200px]">{work.title}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[work.status]}`}>
                          {STATUS_LABEL[work.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{work.startDate}</td>
                      <td className={`px-4 py-3 whitespace-nowrap font-medium ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {work.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {staff && (
                            <img src={staff.photo} alt={staff.name} className="w-6 h-6 rounded-full" />
                          )}
                          <span className="text-slate-700 whitespace-nowrap">{work.staffName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${work.status === 'completed' ? 'bg-green-500' : work.status === 'overdue' ? 'bg-red-400' : 'bg-orange-500'}`}
                              style={{ width: `${work.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{work.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
