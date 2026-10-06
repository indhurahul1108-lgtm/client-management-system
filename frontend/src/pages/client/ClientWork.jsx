import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, AlertTriangle, ClipboardList } from 'lucide-react';

function Badge({ status }) {
  const map = { overdue: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function ClientWork() {
  const { user } = useAuth();
  const myTasks = DUMMY_OVERDUE.filter(o => o.clientId === user?.clientId);

  const completed = myTasks.filter(t => t.status === 'completed').length;
  const pending   = myTasks.filter(t => t.status === 'pending').length;
  const overdue   = myTasks.filter(t => t.status === 'overdue').length;

  const assignedStaff = DUMMY_USERS.find(u => u.staffId === user?.assignedStaffId);

  return (
    <DashboardLayout title="My Work">

      {/* Assigned Staff */}
      {assignedStaff && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-5 mb-6 text-white flex items-center gap-4">
          <img src={assignedStaff.photo} alt={assignedStaff.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/40" />
          <div>
            <p className="text-orange-100 text-xs font-medium">Your Assigned Staff</p>
            <p className="font-bold text-lg">{assignedStaff.name}</p>
            <p className="text-orange-100 text-sm">📞 {assignedStaff.mobile}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
          <ClipboardList size={22} className="text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-700">{myTasks.length}</p>
          <p className="text-xs text-blue-500 font-medium">Total Tasks</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <CheckCircle size={22} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-700">{completed}</p>
          <p className="text-xs text-green-500 font-medium">Completed</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
          <Clock size={22} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-xs text-yellow-500 font-medium">Pending</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">My Tasks & Work</h3>
        </div>
        {myTasks.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {myTasks.map(t => (
              <div key={t.id} className={`px-6 py-4 flex items-start justify-between hover:bg-slate-50 transition
                ${t.status === 'overdue' ? 'border-l-4 border-red-400' : t.status === 'completed' ? 'border-l-4 border-green-400' : 'border-l-4 border-yellow-400'}`}>
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{t.task}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <p className="text-xs text-slate-400">Due: {t.dueDate}</p>
                    {t.overdueDays > 0 && <span className="text-xs text-red-500 font-medium">+{t.overdueDays} days overdue</span>}
                    {t.remarks && <p className="text-xs text-slate-400 italic">{t.remarks}</p>}
                  </div>
                </div>
                <Badge status={t.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks assigned yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
