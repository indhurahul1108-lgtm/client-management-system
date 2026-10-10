import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_MANAGERS, DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { SHIFTS, getShiftById } from '../../utils/attendanceUtils.js';
import { Search, Plus, Edit2, X, Save, Users, Calendar, IndianRupee, Clock, Briefcase, Eye } from 'lucide-react';

const managerList = DUMMY_MANAGERS;
const initialClients = DUMMY_USERS.filter(u => u.role === 'client');

// Initialize staff with multiple clients and shift
const initialStaff = DUMMY_USERS.filter(u => u.role === 'staff').map((s, idx) => {
  // Associate multiple clients with this staff
  const clientsAssigned = initialClients.filter(c => c.assignedStaffId === s.staffId || c.assignedStaffId === s.id);
  // Default to at least 2 clients for demonstration if less
  const clientIds = clientsAssigned.length > 0
    ? clientsAssigned.map(c => c.clientId || c.id)
    : [initialClients[idx % initialClients.length]?.clientId || 'c001', initialClients[(idx + 1) % initialClients.length]?.clientId || 'c002'];

  return {
    ...s,
    salary: s.salary || 28000 + (idx * 1500),
    shiftId: s.shiftId || (idx % 3 === 0 ? 'shift_1' : idx % 3 === 1 ? 'shift_2' : 'shift_3'),
    assignedClientIds: s.assignedClientIds || clientIds,
  };
});

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {status}
    </span>
  );
}

export default function ManageStaff() {
  const [staff, setStaff] = useState(initialStaff);
  const [allClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShift, setFilterShift] = useState('all');
  const [modal, setModal] = useState(false); // 'add' | 'edit' | false
  const [form, setForm] = useState({
    name: '', mobile: '', address: '', managerId: 'm001', status: 'active',
    salary: 30000, shiftId: 'shift_2', assignedClientIds: [], joiningDate: new Date().toISOString().split('T')[0]
  });
  const [editId, setEditId] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [detailTab, setDetailTab] = useState('attendance');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => {
    setForm({
      name: '', mobile: '', address: '', managerId: 'm001', status: 'active',
      salary: 30000, shiftId: 'shift_2', assignedClientIds: ['c001', 'c002'], joiningDate: new Date().toISOString().split('T')[0]
    });
    setEditId(null);
    setModal('add');
  };

  const openEdit = (s) => {
    setForm({
      name: s.name, mobile: s.mobile, address: s.address || '',
      managerId: s.managerId || 'm001', status: s.status,
      salary: s.salary || 30000, shiftId: s.shiftId || 'shift_2',
      assignedClientIds: s.assignedClientIds || [],
      joiningDate: s.joiningDate || s.joinDate || ''
    });
    setEditId(s.id);
    setModal('edit');
  };

  const toggleStatus = (id) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
    showToast('✅ Status updated!');
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) { showToast('Name and Mobile are required!'); return; }
    if (form.mobile.length !== 10) { showToast('Mobile must be 10 digits!'); return; }

    if (modal === 'add') {
      const newStaff = {
        id: `s_${Date.now()}`,
        role: 'staff',
        staffId: `s${(staff.length + 1).toString().padStart(3, '0')}`,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=16a34a&color=fff&size=128`,
        password: 'staff123',
        ...form,
        salary: Number(form.salary),
      };
      setStaff(prev => [newStaff, ...prev]);
      showToast('✅ Staff added successfully with clients & shift!');
    } else {
      setStaff(prev => prev.map(s => s.id === editId ? { ...s, ...form, salary: Number(form.salary) } : s));
      showToast('✅ Staff details updated!');
    }
    setModal(false);
  };

  const openStaffDetail = (s) => {
    setDetailModal(s);
    setDetailTab('attendance');
  };

  const toggleClientAssignment = (cId) => {
    setForm(prev => {
      const current = prev.assignedClientIds || [];
      const updated = current.includes(cId)
        ? current.filter(id => id !== cId)
        : [...current, cId];
      return { ...prev, assignedClientIds: updated };
    });
  };

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchShift = filterShift === 'all' || s.shiftId === filterShift;
    return matchSearch && matchStatus && matchShift;
  });

  // 3-Month Data for selected staff
  const staffAttendance = (s) => DUMMY_ATTENDANCE.filter(a => a.userId === s?.id || a.staffName === s?.name).slice(0, 30);
  const staffLeaves = (s) => DUMMY_LEAVES.filter(l => l.staffId === s?.id || l.staffName === s?.name);
  const staffSalaries = (s) => DUMMY_SALARIES.filter(sal => sal.staffId === s?.id || sal.staffName === s?.name);
  const staffClients = (s) => allClients.filter(c => (s?.assignedClientIds || []).includes(c.clientId) || c.assignedStaffId === s?.staffId);

  return (
    <DashboardLayout title="Staff Management">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-700">{staff.length}</p>
          <p className="text-xs text-slate-500 font-medium">Total Staff</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-blue-700">{staff.filter(s => s.status === 'active').length}</p>
          <p className="text-xs text-slate-500 font-medium">Active Staff</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-purple-700">3 Shifts</p>
          <p className="text-xs text-slate-500 font-medium">Morning / General / Night</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-orange-700">Multi-Client</p>
          <p className="text-xs text-slate-500 font-medium">Multiple Clients per Staff</p>
        </div>
      </div>

      {/* Filters and Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search staff by name or mobile..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterShift}
            onChange={e => setFilterShift(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Shifts</option>
            {SHIFTS.map(sh => (
              <option key={sh.id} value={sh.id}>{sh.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Staff Member', 'Shift Assigned', 'Assigned Clients (Multi)', 'Monthly Salary', 'Manager', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => {
                const shiftInfo = getShiftById(s.shiftId);
                const assignedCls = allClients.filter(c => (s.assignedClientIds || []).includes(c.clientId) || c.assignedStaffId === s.staffId);
                const mgr = managerList.find(m => m.managerId === s.managerId);

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          {/* Click Name -> 3 Month Details */}
                          <button
                            onClick={() => openStaffDetail(s)}
                            className="font-bold text-slate-800 hover:text-green-700 text-left text-xs transition underline decoration-dotted"
                            title="Click to view 3-month attendance & salary"
                          >
                            {s.name}
                          </button>
                          <p className="text-xs text-slate-400 font-mono">{s.staffId || s.id} · {s.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        <Clock size={11} /> {shiftInfo.name} ({shiftInfo.start} - {shiftInfo.end})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {assignedCls.length > 0 ? (
                          assignedCls.map(c => (
                            <span key={c.id} className="text-[11px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100 font-medium">
                              🏢 {c.name.split(' ')[0]}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None assigned</span>
                        )}
                        <span className="text-[10px] text-slate-400 self-center">({assignedCls.length} clients)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold text-slate-800 text-xs font-mono">
                        ₹{(s.salary || 30000).toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-slate-400">/ month</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {mgr?.name || s.managerId || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={s.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openStaffDetail(s)}
                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
                          title="View 3-Month Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold"
                          title="Edit Staff"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => toggleStatus(s.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${s.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}
                        >
                          {s.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No staff found</p>}
      </div>

      {/* ── 3-MONTH DETAILS MODAL (Staff Name Click) ───────────────── */}
      {detailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={detailModal.photo} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" />
                <div>
                  <h3 className="text-lg font-bold">{detailModal.name}</h3>
                  <p className="text-xs text-green-100">Staff ID: {detailModal.staffId} · {detailModal.mobile} · Shift: {getShiftById(detailModal.shiftId).name}</p>
                  <p className="text-xs text-green-200 font-mono mt-0.5">Salary: ₹{(detailModal.salary || 30000).toLocaleString('en-IN')}/mo</p>
                </div>
              </div>
              <button onClick={() => setDetailModal(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 overflow-x-auto bg-slate-50">
              {[
                { id: 'attendance', label: '📅 3-Month Attendance' },
                { id: 'clients', label: '🏢 Assigned Clients (Multi)' },
                { id: 'leaves', label: '🏖️ Leaves' },
                { id: 'salary', label: '💰 Salary Records' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-t-xl transition ${detailTab === t.id ? 'bg-white text-green-700 shadow-sm border-t border-x border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[55vh]">
              {detailTab === 'attendance' && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                    <span>Showing recent 3 months log for {detailModal.name}</span>
                    <span className="font-semibold text-green-700">Assigned Shift: {getShiftById(detailModal.shiftId).label}</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Punch In</th>
                        <th className="p-2 text-left">Punch Out</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffAttendance(detailModal).map((att, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-mono text-slate-600">{att.date}</td>
                          <td className="p-2 font-semibold text-slate-700">{att.punchIn || '—'}</td>
                          <td className="p-2 text-slate-500">{att.punchOut || '—'}</td>
                          <td className="p-2 text-slate-500 truncate max-w-[120px]">{att.location || 'Office'}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${att.status === 'present' ? 'bg-green-100 text-green-700' : att.status === 'late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {att.status} {att.lateMinutes > 0 && `(+${att.lateMinutes}m)`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {staffAttendance(detailModal).length === 0 && <p className="text-center py-6 text-slate-400">No attendance records found</p>}
                </div>
              )}

              {detailTab === 'clients' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">All clients assigned to this staff member (Multiple Client Handling):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staffClients(detailModal).map(c => (
                      <div key={c.id} className="p-3 border border-slate-200 rounded-xl bg-orange-50/30">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏢</span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{c.name}</p>
                            <p className="text-[11px] text-slate-400">{c.clientId} · {c.mobile}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-2 font-medium">Service: {c.service || 'Audit & Accounts'}</p>
                      </div>
                    ))}
                  </div>
                  {staffClients(detailModal).length === 0 && <p className="text-center py-6 text-slate-400">No clients assigned to this staff member.</p>}
                </div>
              )}

              {detailTab === 'leaves' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Leave applications for last 3 months:</p>
                  <div className="space-y-2">
                    {staffLeaves(detailModal).map(l => (
                      <div key={l.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-700">{l.leaveType} ({l.fromDate} to {l.toDate})</p>
                          <p className="text-[11px] text-slate-500 italic">"{l.reason}"</p>
                          {l.rejectReason && <p className="text-[11px] text-red-600 font-semibold mt-0.5">Rejection Reason: {l.rejectReason}</p>}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${l.status === 'approved' ? 'bg-green-100 text-green-700' : l.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  {staffLeaves(detailModal).length === 0 && <p className="text-center py-6 text-slate-400">No leave records</p>}
                </div>
              )}

              {detailTab === 'salary' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Salary History & Monthly Payouts:</p>
                  <div className="space-y-2">
                    {staffSalaries(detailModal).map(sal => (
                      <div key={sal.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-700">{sal.month}</p>
                          <p className="text-[11px] text-slate-500">Basic: ₹{sal.basic?.toLocaleString('en-IN')} | Allw: +₹{sal.allowance} | Ded: -₹{sal.deduction}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800 text-sm">₹{(sal.netSalary || (sal.basic + sal.allowance - sal.deduction)).toLocaleString('en-IN')}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${sal.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{sal.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {staffSalaries(detailModal).length === 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <p className="text-xs text-slate-500">Standard Base Salary: <span className="font-bold text-slate-700">₹{(detailModal.salary || 30000).toLocaleString('en-IN')}</span> per month</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT STAFF MODAL ───────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">{modal === 'add' ? 'Add New Staff Member' : 'Edit Staff Details'}</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Full Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Staff name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Mobile (10 digits) *</label>
                  <input
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    placeholder="Mobile number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* 3 Shifts Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Assign Shift *</label>
                <div className="grid grid-cols-3 gap-2">
                  {SHIFTS.map(sh => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setForm({ ...form, shiftId: sh.id })}
                      className={`p-2.5 rounded-xl border text-left transition ${form.shiftId === sh.id ? 'border-green-600 bg-green-50 text-green-800 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 text-xs'}`}
                    >
                      <p className="text-xs font-bold">{sh.name}</p>
                      <p className="text-[10px] text-slate-500">{sh.start} - {sh.end}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Salary Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Assigned Manager</label>
                  <select
                    value={form.managerId}
                    onChange={e => setForm({ ...form, managerId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    {managerList.map(m => (
                      <option key={m.managerId} value={m.managerId}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multiple Clients Selection (One Staff -> Many Clients) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Assign Clients (Select Multiple)</label>
                  <span className="text-[11px] font-bold text-green-700">{(form.assignedClientIds || []).length} Selected</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl max-h-36 overflow-y-auto space-y-1 bg-slate-50">
                  {allClients.map(c => {
                    const isSelected = (form.assignedClientIds || []).includes(c.clientId || c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleClientAssignment(c.clientId || c.id)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="font-semibold text-slate-700">{c.name}</span>
                        <span className="text-slate-400 text-[10px]">({c.clientId})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow"
              >
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
