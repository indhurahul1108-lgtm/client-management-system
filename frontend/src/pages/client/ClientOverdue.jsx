import React from 'react';
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

export default function ClientOverdue() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const overdueWorks = data.works.filter(
    (w) => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')
  );

  const getStaff = (staffId) => DUMMY_USERS.find((u) => u.staffId === staffId);

  return (
    <DashboardLayout title="Overdue Work">
      {overdueWorks.length === 0 ? (
        /* ── Empty / Success State ── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">No overdue items! Great work!</h2>
          <p className="text-slate-500 text-sm">All your work is on track. Keep it up!</p>
        </div>
      ) : (
        <>
          {/* ── Warning Banner ── */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-700 text-base">These items need immediate attention</p>
              <p className="text-red-500 text-sm mt-0.5">
                You have <strong>{overdueWorks.length}</strong> overdue{' '}
                {overdueWorks.length === 1 ? 'item' : 'items'}. Contact your assigned staff to resolve these items.
              </p>
            </div>
          </div>

          {/* ── Info Banner ── */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 mb-6 text-sm text-orange-700">
            <span className="text-lg">📞</span>
            <span>Contact your assigned staff to resolve these items. You cannot make changes directly.</span>
          </div>

          {/* ── Overdue Cards ── */}
          <div className="space-y-4">
            {overdueWorks.map((work) => {
              const overdueDays = calcOverdueDays(work.dueDate);
              const staff = getStaff(work.staffId);
              return (
                <div
                  key={work.id}
                  className="bg-white rounded-xl border border-red-100 shadow-sm p-5 flex flex-col gap-3"
                >
                  {/* Top Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        {work.workId}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[work.status]}`}>
                        {STATUS_LABEL[work.status]}
                      </span>
                    </div>
                    {overdueDays > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        🔴 {overdueDays} {overdueDays === 1 ? 'Day' : 'Days'} Overdue
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-lg">{work.title}</h3>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Due Date</p>
                      <p className="font-semibold text-red-600">{work.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Updated</p>
                      <p className="font-medium text-slate-600">{work.lastUpdated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Progress</p>
                      <p className="font-medium text-slate-600">{work.progress}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Priority</p>
                      <p className={`font-semibold capitalize ${work.priority === 'high' ? 'text-red-600' : work.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {work.priority}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{work.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: `${work.progress}%` }} />
                    </div>
                  </div>

                  {/* Staff Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    {staff && (
                      <img src={staff.photo} alt={staff.name} className="w-9 h-9 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="text-xs text-slate-400">Assigned Staff</p>
                      <p className="text-sm font-semibold text-slate-700">{work.staffName}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
