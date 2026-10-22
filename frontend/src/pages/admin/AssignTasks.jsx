import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_TASKS } from '../../data/dummyData.jsx';
import { Plus, X, Save, ClipboardList, AlertTriangle, Clock, CheckCircle, User, Users, Building2, Check, CheckSquare, Square } from 'lucide-react';

const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
const clientList = DUMMY_USERS.filter(u => u.role === 'client');

// Initialize tasks supporting multiple staff and multiple clients
const initialTasks = DUMMY_TASKS.map((t, idx) => ({
  ...t,
  staffIds: [t.staffId || 's001', ...(idx % 2 === 0 ? ['s002'] : [])],
  clientIds: [t.clientId || 'c001', ...(idx % 3 === 0 ? ['c002'] : [])],
}));

const emptyForm = {
  task: '',
  clientIds: ['c001'],
  staffIds: ['s001'],
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'medium',
  remarks: '',
};

function Badge({ status }) {
  const map = {
    in_progress: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700'
  };
  const label = status === 'in_progress' ? 'In Progress' : status;
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{label}</span>;
}

function PriorityBadge({ priority }) {
  const map = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[priority] || 'bg-slate-100 text-slate-600'}`}>{priority}</span>;
}

export default function AssignTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterTab, setFilterTab] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleStaff = (id) => {
    setForm(prev => {
      const exists = prev.staffIds.includes(id);
      const updated = exists ? prev.staffIds.filter(x => x !== id) : [...prev.staffIds, id];
      return { ...prev, staffIds: updated };
    });
  };

  const selectAllStaff = () => {
    setForm(prev => ({ ...prev, staffIds: staffList.map(s => s.staffId || s.id) }));
  };

  const clearStaff = () => {
    setForm(prev => ({ ...prev, staffIds: [] }));
  };

  const toggleClient = (id) => {
    setForm(prev => {
      const exists = prev.clientIds.includes(id);
      const updated = exists ? prev.clientIds.filter(x => x !== id) : [...prev.clientIds, id];
      return { ...prev, clientIds: updated };
    });
  };

  const selectAllClients = () => {
    setForm(prev => ({ ...prev, clientIds: clientList.map(c => c.clientId || c.id) }));
  };

  const clearClients = () => {
    setForm(prev => ({ ...prev, clientIds: [] }));
  };

  const handleSave = () => {
    if (!form.task.trim()) {
      showToast('⚠️ Task description is required!');
      return;
    }
    if (form.staffIds.length === 0) {
      showToast('⚠️ Please select at least one staff member!');
      return;
    }
    if (!form.dueDate) {
      showToast('⚠️ Due date is required!');
      return;
    }

    const assignedStaffMembers = staffList.filter(s => form.staffIds.includes(s.staffId || s.id));
    const assignedClientMembers = clientList.filter(c => form.clientIds.includes(c.clientId || c.id));
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(form.dueDate);
    const now = new Date();
    const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));

    const newTask = {
      id: `t_${Date.now()}`,
      task: form.task,
      staffIds: form.staffIds,
      staffId: form.staffIds[0],
      staffName: assignedStaffMembers.map(s => s.name).join(', '),
      clientIds: form.clientIds,
      clientId: form.clientIds[0] || 'c001',
      clientName: assignedClientMembers.length > 0
        ? assignedClientMembers.map(c => c.name).join(', ')
        : 'All Deployed Bunks',
      dueDate: form.dueDate,
      status: 'pending',
      remarks: form.remarks,
      priority: form.priority,
      assignedOn: today,
    };

    setTasks(prev => [newTask, ...prev]);
    setForm(emptyForm);
    setModal(false);
    showToast(`✅ Task assigned to ${assignedStaffMembers.length} staff & ${assignedClientMembers.length} clients!`);
  };

  const markComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    showToast('✅ Task marked as completed!');
  };

  const filtered = filterTab === 'all' ? tasks : tasks.filter(t => t.status === filterTab);

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <DashboardLayout title="Assign Tasks">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: counts.all, color: 'blue', icon: <ClipboardList size={20} className="text-white" /> },
          { label: 'Pending', value: counts.pending, color: 'yellow', icon: <Clock size={20} className="text-white" /> },
          { label: 'In Progress', value: counts.in_progress, color: 'indigo', icon: <AlertTriangle size={20} className="text-white" /> },
          { label: 'Completed', value: counts.completed, color: 'green', icon: <CheckCircle size={20} className="text-white" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm`}>
            <div className={`w-11 h-11 bg-${color}-600 rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
            <div>
              <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
              <p className="text-xs font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'in_progress', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                  filterTab === tab ? 'bg-blue-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'in_progress' ? 'In Progress' : tab} ({counts[tab]})
              </button>
            ))}
          </div>

          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus size={16} /> Assign New Task
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Task Description</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Related Clients / Bunks</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Assigned Staff Team</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => {
                const assignedStaffList = staffList.filter(s => (t.staffIds || [t.staffId]).includes(s.staffId || s.id));
                const assignedClientsList = clientList.filter(c => (t.clientIds || [t.clientId]).includes(c.clientId || c.id));

                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-800 max-w-[220px]">
                      <p className="font-bold text-xs">{t.task}</p>
                      {t.remarks && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{t.remarks}</p>}
                    </td>

                    {/* Related Clients / Candidates */}
                    <td className="px-4 py-3.5 text-xs">
                      {assignedClientsList.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {assignedClientsList.slice(0, 2).map(c => (
                              <span key={c.id} className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                🏢 {c.name}
                              </span>
                            ))}
                            {assignedClientsList.length > 2 && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                                +{assignedClientsList.length - 2} More
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {assignedClientsList[0]?.assignedBunk || 'Petrol Bunk Station'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">{t.clientName || 'General'}</span>
                      )}
                    </td>

                    {/* Assigned Staff Team (Multi-Staff Display) */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {assignedStaffList.slice(0, 2).map(s => (
                          <div key={s.id} className="flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-200 px-2 py-1 rounded-xl text-xs font-semibold">
                            <img src={s.photo} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
                            <span>{s.name}</span>
                          </div>
                        ))}
                        {assignedStaffList.length > 2 && (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-xl">
                            +{assignedStaffList.length - 2} More Staff
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-mono text-slate-600 whitespace-nowrap">{t.dueDate}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><PriorityBadge priority={t.priority || 'medium'} /></td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><Badge status={t.status} /></td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {t.status !== 'completed' && (
                        <button
                          onClick={() => markComplete(t.id)}
                          className="inline-flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold transition shadow-sm"
                        >
                          <CheckCircle size={13} /> Done
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

      {/* ── Assign Task Modal (Multi-Staff & Multi-Client Selection) ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                <span>Assign Task (Multi-Staff & Multi-Client Selection)</span>
              </h2>
              <button
                onClick={() => setModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Task Description */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Task Description *</label>
                <textarea
                  value={form.task}
                  onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                  rows={2}
                  placeholder="E.g., Bunk fuel dispenser meter check & cash collection..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* ── Multi-Select Staff Members ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Users size={14} className="text-green-600" />
                    <span>Assign To Staff (Select one or multiple staff) *</span>
                    <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {form.staffIds.length} Selected
                    </span>
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllStaff}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={clearStaff}
                      className="text-slate-500 hover:text-red-600 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {staffList.map(s => {
                    const isSelected = form.staffIds.includes(s.staffId || s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleStaff(s.staffId || s.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border text-xs transition ${
                          isSelected
                            ? 'bg-green-50 border-green-500 text-green-900 shadow-sm font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-green-600 pointer-events-none"
                        />
                        <img src={s.photo} alt={s.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="truncate">{s.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Multi-Select Related Clients / Candidates ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Building2 size={14} className="text-orange-600" />
                    <span>Related Clients / Candidates (Select one or multiple)</span>
                    <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {form.clientIds.length} Selected
                    </span>
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllClients}
                      className="text-orange-600 font-bold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={clearClients}
                      className="text-slate-500 hover:text-red-600 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {clientList.map(c => {
                    const isSelected = form.clientIds.includes(c.clientId || c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleClient(c.clientId || c.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border text-xs transition ${
                          isSelected
                            ? 'bg-orange-50 border-orange-500 text-orange-900 shadow-sm font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-orange-600 pointer-events-none"
                        />
                        <div className="truncate">
                          <p className="truncate font-semibold">{c.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{c.assignedBunk || 'Petrol Bunk'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Due Date *</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Remarks (optional)</label>
                <textarea
                  value={form.remarks}
                  onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                  rows={2}
                  placeholder="Instructions for staff & client attendants..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow"
              >
                <Save size={15} /> Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
