import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, getClientData } from '../../data/clientData.js';
import { Search, Plus, Edit2, X, Save, Building2, Phone, MapPin, User, Eye, Briefcase, FileText, CalendarCheck, Printer, Users } from 'lucide-react';
import { printIndividualRecord } from '../../utils/printUtils.js';

const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
const initialClients = DUMMY_USERS.filter(u => u.role === 'client').map((c, idx) => ({
  ...c,
  assignedStaffIds: c.assignedStaffIds || (c.assignedStaffId ? [c.assignedStaffId, staffList[(idx + 1) % staffList.length]?.staffId || 's002'] : ['s001', 's002']),
}));

const emptyForm = {
  name: '',
  mobile: '',
  address: '',
  service: '',
  assignedStaffIds: ['s001', 's002'],
  status: 'active',
  email: '',
  notes: '',
  assignedBunk: '',
  bunkLocation: '',
  roleAtBunk: 'Fuel Dispenser Attendant',
  shift: 'Shift 1: Morning (06:00 AM - 02:00 PM)',
  salary: 18500
};

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {status}
    </span>
  );
}

export default function ManageClients() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState(false); // 'add' | 'edit' | false
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [detailTab, setDetailTab] = useState('attendance');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = (c) => {
    setForm({
      name: c.name,
      mobile: c.mobile,
      address: c.address || '',
      service: c.service || '',
      assignedStaffIds: c.assignedStaffIds || (c.assignedStaffId ? [c.assignedStaffId] : ['s001']),
      status: c.status,
      email: c.email || '',
      notes: c.notes || '',
      assignedBunk: c.assignedBunk || '',
      bunkLocation: c.bunkLocation || '',
      roleAtBunk: c.roleAtBunk || 'Fuel Dispenser Attendant',
      shift: c.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      salary: c.salary || 18500
    });
    setEditId(c.id);
    setModal('edit');
  };

  const toggleStaffAssignment = (sId) => {
    setForm(prev => {
      const current = prev.assignedStaffIds || [];
      const updated = current.includes(sId)
        ? current.filter(id => id !== sId)
        : [...current, sId];
      return { ...prev, assignedStaffIds: updated };
    });
  };

  const toggleStatus = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    showToast('Client status updated successfully!');
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) { showToast('Name and Mobile are required!'); return; }
    if (form.mobile.length !== 10) { showToast('Mobile must be 10 digits!'); return; }
    if (!form.assignedStaffIds || form.assignedStaffIds.length === 0) {
      showToast('Please assign at least one staff member!');
      return;
    }

    if (modal === 'add') {
      const newClient = {
        ...emptyForm,
        ...form,
        id: `c_${Date.now()}`,
        role: 'client',
        clientId: `c${(clients.length + 1).toString().padStart(3, '0')}`,
        assignedStaffId: form.assignedStaffIds[0] || 's001',
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=f97316&color=fff&size=128`,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
      showToast('Client added successfully with assigned staff team!');
    } else {
      setClients(prev => prev.map(c => c.id === editId ? {
        ...c,
        ...form,
        assignedStaffId: form.assignedStaffIds[0] || c.assignedStaffId || 's001',
      } : c));
      showToast('Client details updated successfully!');
    }
    setModal(false);
  };

  const openClientDetail = (c) => {
    setDetailModal(c);
    setDetailTab('attendance');
  };

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      (c.service || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.assignedBunk || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Client Management">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-orange-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-orange-700">{clients.length}</p>
          <p className="text-xs text-slate-500 font-medium">Total Clients / Candidates</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-slate-500 font-medium">Active Deployments</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-blue-700">{staffList.length}</p>
          <p className="text-xs text-slate-500 font-medium">Field Staff Supervisors</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-purple-700">Multi-Staff</p>
          <p className="text-xs text-slate-500 font-medium">Team Allocation Enabled</p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients by candidate name, station, mobile..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
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
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Client / Candidate', 'Assigned Petrol Bunk', 'Shift & Role', 'Salary (Monthly)', 'Assigned Staff (Multi)', 'Mobile', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => {
                const assignedStaffMembers = staffList.filter(s =>
                  (c.assignedStaffIds || [c.assignedStaffId || 's001']).includes(s.staffId || s.id)
                );

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <button
                            onClick={() => openClientDetail(c)}
                            className="font-bold text-slate-800 hover:text-orange-600 text-left text-xs transition underline decoration-dotted"
                            title="Click to view candidate details"
                          >
                            {c.name}
                          </button>
                          <p className="text-[11px] text-slate-400 font-mono">{c.clientId?.toUpperCase() || c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-800">{c.assignedBunk || 'Petrol Bunk'}</p>
                      <p className="text-[11px] text-slate-400">{c.bunkLocation || 'Chennai'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg block w-fit">
                        {c.roleAtBunk || 'Worker'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{c.shift || 'Shift 1'}</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 text-xs">
                      ₹{(c.salary || 18500).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        {assignedStaffMembers.length > 0 ? (
                          assignedStaffMembers.map(st => (
                            <div key={st.id} className="flex items-center gap-1.5">
                              <img src={st.photo} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                              <span className="text-xs font-medium text-slate-700">{st.name}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Staff Assigned</span>
                        )}
                        <span className="text-[10px] text-orange-600 font-semibold font-mono">
                          {assignedStaffMembers.length} Staff Assigned
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {c.mobile}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={c.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openClientDetail(c)}
                          className="p-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold"
                          title="View 3-Month Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => printIndividualRecord({
                            title: 'Candidate / Client 3-Month Attendance Statement',
                            person: {
                              name: c.name,
                              staffId: c.clientId,
                              mobile: c.mobile,
                              role: 'Client Candidate',
                              roleAtBunk: c.roleAtBunk || 'Worker',
                              assignedBunk: c.assignedBunk || 'Petrol Bunk',
                              shift: c.shift || 'Shift 1: Morning',
                            },
                            type: 'attendance',
                            records: [
                              { date: '2026-10-10', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '05:55 AM', out: '02:05 PM', status: 'present' },
                              { date: '2026-10-09', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                              { date: '2026-10-08', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '06:12 AM', out: '02:00 PM', status: 'late', lateMinutes: 12 },
                              { date: '2026-10-07', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                              { date: '2026-09-30', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '05:55 AM', out: '02:00 PM', status: 'present' },
                              { date: '2026-09-29', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                              { date: '2026-08-31', bunk: c.assignedBunk || 'IOCL Petrol Bunk', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                            ]
                          })}
                          className="p-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold"
                          title="Print 3-Month Attendance Statement"
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold"
                          title="Edit Client"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => toggleStatus(c.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${c.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}
                        >
                          {c.status === 'active' ? 'Deactivate' : 'Activate'}
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

      {/* ── DETAIL MODAL ─────────────────────────────────── */}
      {detailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={detailModal.photo} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md" />
                <div>
                  <h3 className="text-xl font-black">{detailModal.name}</h3>
                  <p className="text-orange-100 text-xs mt-0.5">{detailModal.roleAtBunk || 'Candidate'} · {detailModal.clientId?.toUpperCase()}</p>
                  <p className="text-orange-200 text-xs mt-1">📞 {detailModal.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const p = {
                      name: detailModal.name,
                      staffId: detailModal.clientId,
                      mobile: detailModal.mobile,
                      role: 'Client Candidate',
                      roleAtBunk: detailModal.roleAtBunk || 'Worker',
                      assignedBunk: detailModal.assignedBunk || 'Petrol Bunk',
                      shift: detailModal.shift || 'Shift 1: Morning',
                    };
                    if (detailTab === 'salary') {
                      printIndividualRecord({
                        title: 'Candidate Salary & Payout Statement',
                        person: p,
                        type: 'salary',
                        records: [
                          { month: 'October 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, status: 'pending', paidOn: '—' },
                          { month: 'September 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, status: 'paid', paidOn: '2026-09-05' },
                          { month: 'August 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, status: 'paid', paidOn: '2026-08-05' },
                        ]
                      });
                    } else {
                      printIndividualRecord({
                        title: 'Candidate 3-Month Attendance Statement',
                        person: p,
                        type: 'attendance',
                        records: [
                          { date: '2026-10-10', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:55 AM', out: '02:05 PM', status: 'present' },
                          { date: '2026-10-09', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                          { date: '2026-10-08', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:12 AM', out: '02:00 PM', status: 'late', lateMinutes: 12 },
                          { date: '2026-10-07', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                          { date: '2026-09-30', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:55 AM', out: '02:00 PM', status: 'present' },
                          { date: '2026-09-29', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                          { date: '2026-08-31', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                        ]
                      });
                    }
                  }}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                  title="Print this candidate record"
                >
                  <Printer size={13} /> Print
                </button>
                <button onClick={() => setDetailModal(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30"><X size={18} /></button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 overflow-x-auto bg-slate-50">
              {[
                { id: 'attendance', label: '📅 3-Month Attendance' },
                { id: 'staff', label: '👥 Assigned Staff Team' },
                { id: 'salary', label: '💰 3-Month Salary' },
                { id: 'details', label: '⛽ Station & KYC Info' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-t-xl transition ${detailTab === t.id ? 'bg-white text-orange-700 shadow-sm border-t border-x border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[55vh]">
              {detailTab === 'attendance' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">
                      Attendance Log for <span className="font-bold text-slate-800">{detailModal.name}</span> (Last 3 Months):
                    </p>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                      {detailModal.shift || 'Shift 1'}
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Assigned Bunk</th>
                        <th className="p-2 text-left">Punch In</th>
                        <th className="p-2 text-left">Punch Out</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { date: '2026-10-10', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:55 AM', out: '02:05 PM', status: 'present' },
                        { date: '2026-10-09', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                        { date: '2026-10-08', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:12 AM', out: '02:00 PM', status: 'late' },
                        { date: '2026-10-07', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                        { date: '2026-09-30', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:55 AM', out: '02:00 PM', status: 'present' },
                        { date: '2026-09-29', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                        { date: '2026-09-28', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:15 AM', out: '02:00 PM', status: 'late' },
                        { date: '2026-08-31', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '05:58 AM', out: '02:00 PM', status: 'present' },
                        { date: '2026-08-30', bunk: detailModal.assignedBunk || 'IOCL Anna Salai', in: '06:00 AM', out: '02:00 PM', status: 'present' },
                      ].map((a, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 text-slate-500 font-mono">{a.date}</td>
                          <td className="p-2 font-medium text-slate-700 truncate max-w-[150px]">{a.bunk}</td>
                          <td className="p-2 font-mono text-slate-800 font-bold">{a.in}</td>
                          <td className="p-2 font-mono text-slate-600">{a.out}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === 'staff' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Supervising Staff Members Assigned to <span className="font-bold text-slate-800">{detailModal.name}</span>:
                    </p>
                    <span className="text-[11px] font-bold text-orange-600">
                      {(detailModal.assignedStaffIds || [detailModal.assignedStaffId || 's001']).length} Supervisors
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staffList
                      .filter(s => (detailModal.assignedStaffIds || [detailModal.assignedStaffId || 's001']).includes(s.staffId || s.id))
                      .map(st => (
                        <div key={st.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                          <img src={st.photo} alt={st.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{st.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono">ID: {st.staffId} · Field Staff</p>
                            <p className="text-xs text-orange-600 font-semibold mt-0.5">📞 {st.mobile}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                    ℹ️ These staff supervisors verify the candidate's physical presence at the petrol bunk station and approve daily duty attendance.
                  </div>
                </div>
              )}

              {detailTab === 'salary' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">
                    3-Month Salary Statement for <span className="font-bold text-slate-800">{detailModal.name}</span>:
                  </p>
                  <div className="space-y-3">
                    {[
                      { month: 'October 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, mode: 'GPay / Pending', status: 'Pending' },
                      { month: 'September 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, mode: 'GPay Transferred', status: 'Paid' },
                      { month: 'August 2026', basic: (detailModal.salary || 18500) - 2500, allowance: 2500, deduction: 0, netSalary: detailModal.salary || 18500, mode: 'Bank Transfer', status: 'Paid' },
                    ].map((m, i) => (
                      <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{m.month}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Basic: ₹{m.basic.toLocaleString('en-IN')} | Allowance: +₹{m.allowance} | Mode: <span className="font-semibold text-blue-600">{m.mode}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-slate-900 font-mono">₹{m.netSalary.toLocaleString('en-IN')}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${m.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === 'details' && (
                <div className="space-y-3">
                  {[
                    ['Candidate Name', detailModal.name],
                    ['Candidate / Client ID', detailModal.clientId?.toUpperCase()],
                    ['Mobile / GPay', detailModal.mobile],
                    ['Assigned Petrol Bunk', detailModal.assignedBunk || 'Indian Oil Petrol Bunk'],
                    ['Station Location', detailModal.bunkLocation || 'Chennai, Tamil Nadu'],
                    ['Role / Duty', detailModal.roleAtBunk || 'Fuel Dispenser Attendant'],
                    ['Assigned Shift', detailModal.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)'],
                    ['Field Manager', `${detailModal.bunkManager || 'Priya Nair'} (📞 ${detailModal.bunkManagerPhone || '9000000002'})`],
                    ['Monthly Salary (Fixed)', `₹${(detailModal.salary || 18500).toLocaleString('en-IN')}`],
                    ['Aadhaar KYC', detailModal.aadhaar || 'XXXX-XXXX-4512'],
                    ['Bank Account', detailModal.bankAccount || 'SBI - 30894512903'],
                    ['Deployment Date', detailModal.joinDate || '2023-01-15'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-slate-100 text-xs">
                      <span className="text-slate-400 uppercase font-semibold">{label}</span>
                      <span className="font-bold text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT CLIENT MODAL ───────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">{modal === 'add' ? 'Add Client / Candidate' : 'Edit Client Details'}</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Candidate / Client Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Karthik Velu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Contact Mobile (10 digits) *</label>
                  <input
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: Number(e.target.value) })}
                    placeholder="18500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Assigned Petrol Bunk *</label>
                <input
                  value={form.assignedBunk}
                  onChange={e => setForm({ ...form, assignedBunk: e.target.value })}
                  placeholder="e.g. Indian Oil Petrol Bunk (IOCL) — Anna Salai"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {/* Multiple Staff Selection (Admin assigns multiple staff to client) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Assign Managing Staff (Select Multiple) *
                  </label>
                  <span className="text-[11px] font-bold text-orange-600">
                    {(form.assignedStaffIds || []).length} Staff Selected
                  </span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl max-h-36 overflow-y-auto space-y-1 bg-slate-50">
                  {staffList.map(st => {
                    const isSelected = (form.assignedStaffIds || []).includes(st.staffId || st.id);
                    return (
                      <label key={st.id} className="flex items-center gap-2.5 p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStaffAssignment(st.staffId || st.id)}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <img src={st.photo} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-semibold text-slate-700">{st.name}</span>
                        <span className="text-slate-400 text-[10px]">({st.staffId})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Role at Bunk</label>
                  <input
                    value={form.roleAtBunk}
                    onChange={e => setForm({ ...form, roleAtBunk: e.target.value })}
                    placeholder="e.g. Lead Fuel Attendant"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Shift</label>
                  <select
                    value={form.shift}
                    onChange={e => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Shift 1: Morning (06:00 AM - 02:00 PM)">Shift 1: Morning (06:00 AM - 02:00 PM)</option>
                    <option value="Shift 2: Evening (02:00 PM - 10:00 PM)">Shift 2: Evening (02:00 PM - 10:00 PM)</option>
                    <option value="Shift 3: Night (10:00 PM - 06:00 AM)">Shift 3: Night (10:00 PM - 06:00 AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Station Address / Location</label>
                <input
                  value={form.address || form.bunkLocation}
                  onChange={e => setForm({ ...form, address: e.target.value, bunkLocation: e.target.value })}
                  placeholder="e.g. Anna Salai, Chennai - 600002"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
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
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
              >
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
