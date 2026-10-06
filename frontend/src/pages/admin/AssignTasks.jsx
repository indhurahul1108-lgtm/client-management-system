import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_OVERDUE } from '../../data/dummyData.jsx';
import { Plus, X, Save, ClipboardList, AlertTriangle, Clock, CheckCircle, User } from 'lucide-react';

const staffList    = DUMMY_USERS.filter(u => u.role === 'staff');
const clientList   = DUMMY_USERS.filter(u => u.role === 'client');

const emptyForm = { task: '', clientId: '', staffId: '', dueDate: '', priority: 'medium', remarks: '' };

function Badge({ status }) {
  const map = { overdue: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const map = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[priority] || 'bg-slate-100 text-slate-600'}`}>{priority}</span>;
}

export default function AssignTasks() {
  const [tasks,     setTasks]     = useState(DUMMY_OVERDUE);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [filterTab, setFilterTab] = useState('all');
  const [toast,     setToast]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = () => {
    if (!form.task || !form.staffId || !form.dueDate) { showToast('Task, Staff and Due Date are required!'); return; }
    const staff  = staffList.find(s => s.staffId === form.staffId);
    const client = clientList.find(c => c.clientId === form.clientId);
    const today  = new Date().toISOString().split('T')[0];
    const due    = new Date(form.dueDate);
    const now    = new Date();
    const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));

    const newTask = {
      id:          `t_${Date.now()}`,
      task:        form.task,
      staffId:     form.staffId,
      staffName:   staff?.name  || '',
      clientId:    form.clientId,
      clientName:  client?.name || 'General',
      dueDate:     form.dueDate,
      status:      'pending',
      overdueDays: diffDays > 0 ? diffDays : 0,
      remarks:     form.remarks,
      priority:    form.priority,
      assignedOn:  today,
    };
    setTasks(prev => [newTask, ...prev]);
    setForm(emptyForm);
    setModal(false);
    showToast('✅ Task assigned successfully!');
  };

  const markComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', overdueDays: 0 } : t));
    showToast('✅ Task marked as completed!');
  };

  const filtered = filterTab === 'all' ? tasks : tasks.filter(t => t.status === filterTab);

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter(t => t.status === 'pending').length,
    overdue:   tasks.filter(t => t.status === 'overdue').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <DashboardLayout title="Assign Tasks">

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm">{toast}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: counts.all,       color: 'blue',   icon: <ClipboardList size={20} className="text-white" /> },
          { label: 'Pending',     value: counts.pending,   color: 'yellow', icon: <Clock         size={20} className="text-white" /> },
          { label: 'Overdue',     value: counts.overdue,   color: 'red',    icon: <AlertTriangle  size={20} className="text-white" /> },
          { label: 'Completed',   value: counts.completed, color: 'green',  icon: <CheckCircle   size={20} className="text-white" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 bg-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
            <div>
              <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'overdue', 'completed'].map(tab => (
              <button key={tab} onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                  ${filterTab === tab ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>
          <button onClick={() => setModal(true)}
            className="ml-auto flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
            <Plus size={16} /> Assign Task
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Overdue</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => {
                const staff = staffList.find(s => s.staffId === t.staffId);
                return (
                  <tr key={t.id} className={`hover:bg-slate-50 transition ${t.status === 'overdue' ? 'bg-red-50/40' : ''}`}>
                    <td className="px-6 py-4 font-medium text-slate-700 max-w-[180px]">
                      <p className="truncate">{t.task}</p>
                      {t.remarks && <p className="text-xs text-slate-400 truncate">{t.remarks}</p>}
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{t.clientName || '—'}</td>
                    <td className="px-4 py-4">
                      {staff ? (
                        <div className="flex items-center gap-2">
                          <img src={staff.photo} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          <span className="text-xs font-medium text-slate-600">{staff.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">{t.staffName || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{t.dueDate}</td>
                    <td className="px-4 py-4"><PriorityBadge priority={t.priority || 'medium'} /></td>
                    <td className="px-4 py-4 text-center">
                      {t.overdueDays > 0
                        ? <span className="text-red-600 font-bold text-xs">+{t.overdueDays}d</span>
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-4"><Badge status={t.status} /></td>
                    <td className="px-4 py-4">
                      {t.status !== 'completed' && (
                        <button onClick={() => markComplete(t.id)}
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition font-medium whitespace-nowrap">
                          <CheckCircle size={12} /> Done
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No tasks found</div>}
      </div>

      {/* Assign Task Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">➕ Assign New Task</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Task Description *</label>
                <textarea value={form.task} onChange={e => setForm(f => ({ ...f, task: e.target.value }))} rows={3}
                  placeholder="Describe the task clearly..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Assign To (Staff) *</label>
                <select value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Staff —</option>
                  {staffList.map(s => <option key={s.id} value={s.staffId}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Related Client (optional)</label>
                <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Client —</option>
                  {clientList.map(c => <option key={c.id} value={c.clientId}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Due Date *</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Remarks (optional)</label>
                <textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} rows={2}
                  placeholder="Additional instructions..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
                <Save size={15} /> Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
