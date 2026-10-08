import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const PRIORITY_COLOR = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const TABS = ['All', 'In Progress', 'Pending', 'Completed', 'Overdue'];

export default function ClientWork() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');
  const works = data.works;

  const [activeTab, setActiveTab] = useState('All');
  const [selectedWork, setSelectedWork] = useState(null);

  const getStaff = (staffId) => DUMMY_USERS.find((u) => u.staffId === staffId);

  const filteredWorks = works.filter((w) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'In Progress') return w.status === 'in_progress';
    if (activeTab === 'Pending') return w.status === 'pending';
    if (activeTab === 'Completed') return w.status === 'completed';
    if (activeTab === 'Overdue') return w.status === 'overdue';
    return true;
  });

  const stats = [
    { label: 'Total', value: works.length, color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { label: 'In Progress', value: works.filter((w) => w.status === 'in_progress').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Completed', value: works.filter((w) => w.status === 'completed').length, color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Overdue', value: works.filter((w) => w.status === 'overdue').length, color: 'bg-red-50 border-red-200 text-red-700' },
  ];

  const isDueDateOverdue = (dueDate, status) =>
    status !== 'completed' && calcOverdueDays(dueDate) > 0;

  return (
    <DashboardLayout title="My Work">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 flex flex-col items-center ${s.color}`}>
            <span className="text-3xl font-bold">{s.value}</span>
            <span className="text-sm font-medium mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === tab
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Work Cards */}
      {filteredWorks.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-lg font-medium">No work items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredWorks.map((work) => {
            const staff = getStaff(work.staffId);
            const overdue = isDueDateOverdue(work.dueDate, work.status);
            return (
              <div
                key={work.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedWork(work)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                    {work.workId}
                  </span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[work.status]}`}>
                      {STATUS_LABEL[work.status]}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${PRIORITY_COLOR[work.priority]}`}>
                      {work.priority}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-800 text-base leading-snug">{work.title}</h3>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-orange-600">{work.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${work.progress}%` }}
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">Due:</span>
                  <span className={overdue ? 'text-red-600 font-semibold' : 'text-slate-700'}>
                    {work.dueDate}
                    {overdue && (
                      <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        {calcOverdueDays(work.dueDate)}d overdue
                      </span>
                    )}
                  </span>
                </div>

                {/* Staff */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  {staff && (
                    <img src={staff.photo} alt={staff.name} className="w-7 h-7 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="text-xs text-slate-400">Assigned Staff</p>
                    <p className="text-sm font-medium text-slate-700">{work.staffName}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-slate-400">Last Updated</p>
                    <p className="text-xs text-slate-500">{work.lastUpdated}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedWork && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">
                    {selectedWork.workId}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{selectedWork.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none ml-4"
                >
                  ✕
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[selectedWork.status]}`}>
                  {STATUS_LABEL[selectedWork.status]}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${PRIORITY_COLOR[selectedWork.priority]}`}>
                  {selectedWork.priority} Priority
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{selectedWork.description}</p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-600">Progress</span>
                  <span className="font-bold text-orange-600">{selectedWork.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${selectedWork.progress}%` }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Start Date</p>
                  <p className="font-medium text-slate-700">{selectedWork.startDate}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Due Date</p>
                  <p className={`font-medium ${calcOverdueDays(selectedWork.dueDate) > 0 && selectedWork.status !== 'completed' ? 'text-red-600' : 'text-slate-700'}`}>
                    {selectedWork.dueDate}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Assigned Staff</p>
                  <p className="font-medium text-slate-700">{selectedWork.staffName}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Manager</p>
                  <p className="font-medium text-slate-700">{selectedWork.managerName}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-slate-400">Last Updated</p>
                  <p className="font-medium text-slate-700">{selectedWork.lastUpdated}</p>
                </div>
              </div>

              {/* Notes / Timeline */}
              {selectedWork.notes && selectedWork.notes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Timeline / Notes
                  </h4>
                  <ol className="relative border-l-2 border-orange-200 ml-2 space-y-3">
                    {selectedWork.notes.map((note, i) => (
                      <li key={i} className="pl-5 relative">
                        <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-700">{note}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedWork(null)}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
