import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, getClientData } from '../../data/clientData.js';
import { Search, Plus, Edit2, X, Save, Building2, Phone, MapPin, User, Eye, Briefcase, FileText, CalendarCheck } from 'lucide-react';

const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
const initialClients = DUMMY_USERS.filter(u => u.role === 'client');

const emptyForm = { name: '', mobile: '', address: '', service: '', assignedStaffId: 's001', status: 'active', email: '', notes: '' };

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
  const [detailTab, setDetailTab] = useState('work');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = (c) => {
    setForm({
      name: c.name, mobile: c.mobile, address: c.address || '', service: c.service || '',
      assignedStaffId: c.assignedStaffId || 's001', status: c.status, email: c.email || '', notes: c.notes || ''
    });
    setEditId(c.id);
    setModal('edit');
  };

  const toggleStatus = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    showToast('✅ Client status updated!');
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) { showToast('Name and Mobile are required!'); return; }
    if (form.mobile.length !== 10) { showToast('Mobile must be 10 digits!'); return; }

    if (modal === 'add') {
      const newClient = {
        ...emptyForm, ...form,
        id: `c_${Date.now()}`,
        role: 'client',
        clientId: `c${(clients.length + 1).toString().padStart(3, '0')}`,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=f97316&color=fff&size=128`,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
      showToast('✅ Client added successfully!');
    } else {
      setClients(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
      showToast('✅ Client updated successfully!');
    }
    setModal(false);
  };

  const openClientDetail = (c) => {
    setDetailModal(c);
    setDetailTab('work');
  };

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search) || (c.service || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getClientWorks = (cId) => CLIENT_WORKS.filter(w => w.clientId === cId || w.clientId === cId?.toLowerCase());
  const clientData = detailModal ? getClientData(detailModal.clientId || 'c001') : null;

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
          <p className="text-xs text-slate-500 font-medium">Total Enterprise Clients</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-slate-500 font-medium">Active Accounts</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-blue-700">{staffList.length}</p>
          <p className="text-xs text-slate-500 font-medium">Managing Staff Team</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-purple-700">100% Secure</p>
          <p className="text-xs text-slate-500 font-medium">Multi-Client Isolation</p>
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
              placeholder="Search clients by company name, mobile, service..."
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
                {['Client / Organization', 'Service / Scope', 'Assigned Staff', 'Mobile & Contact', 'Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => {
                const staff = staffList.find(s => s.staffId === c.assignedStaffId || s.id === c.assignedStaffId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          {/* Click Client Name -> 3-Month Details Modal */}
                          <button
                            onClick={() => openClientDetail(c)}
                            className="font-bold text-slate-800 hover:text-orange-600 text-left text-xs transition underline decoration-dotted"
                            title="Click to view 3-month history & services"
                          >
                            {c.name}
                          </button>
                          <p className="text-xs text-slate-400 font-mono">{c.clientId || c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {c.service || 'Accounts & Audit'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {staff?.photo && <img src={staff.photo} alt="" className="w-6 h-6 rounded-full object-cover" />}
                        <span className="text-xs font-medium text-slate-700">{staff?.name || c.assignedStaffId || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {c.mobile}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {c.joinDate || '2025-01-10'}
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
        {filtered.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No clients found</p>}
      </div>

      {/* ── 3-MONTH DETAILS MODAL (Client Name Click) ───────────────── */}
      {detailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={detailModal.photo} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" />
                <div>
                  <h3 className="text-lg font-bold">{detailModal.name}</h3>
                  <p className="text-xs text-orange-100">Client ID: {detailModal.clientId} · {detailModal.mobile}</p>
                  <p className="text-xs text-orange-200 mt-0.5">Service: {detailModal.service || 'Accounts & Audit'}</p>
                </div>
              </div>
              <button onClick={() => setDetailModal(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 overflow-x-auto bg-slate-50">
              {[
                { id: 'work', label: '💼 Work / Services (3-Mo)' },
                { id: 'requests', label: '📋 Leave & Requests' },
                { id: 'documents', label: '📁 Documents' },
                { id: 'details', label: 'ℹ️ Full Company Info' },
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
              {detailTab === 'work' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Recent 3-Month Work History:</p>
                  <div className="space-y-2">
                    {getClientWorks(detailModal.clientId).map(w => (
                      <div key={w.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-orange-600">{w.workId}</span>
                            <p className="text-xs font-bold text-slate-800">{w.title}</p>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Due: {w.dueDate} · Handled by: {w.staffName}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${w.status === 'completed' ? 'bg-green-100 text-green-700' : w.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {w.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{w.progress}% done</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {getClientWorks(detailModal.clientId).length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-xs">Standard monthly service active.</p>
                  )}
                </div>
              )}

              {detailTab === 'requests' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Client Requests & Leave Status (Last 3 Months):</p>
                  <div className="space-y-2">
                    {(clientData?.requests || []).map(r => (
                      <div key={r.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-700">{r.type} ({r.fromDate} to {r.toDate})</p>
                          <p className="text-[11px] text-slate-500 italic">"{r.reason}"</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  {(clientData?.requests || []).length === 0 && <p className="text-center py-6 text-slate-400">No requests filed recently.</p>}
                </div>
              )}

              {detailTab === 'documents' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Corporate & Legal Documents:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(clientData?.documents || []).map(d => (
                      <div key={d.id} className="p-3 border border-slate-200 rounded-xl bg-white flex items-center gap-3">
                        <span className="text-2xl">{d.icon || '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate">{d.name}</p>
                          <p className="text-[10px] text-slate-400">{d.size} · {d.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === 'details' && (
                <div className="space-y-3">
                  {[
                    ['Company / Org', detailModal.name],
                    ['Client ID', detailModal.clientId],
                    ['Primary Phone', detailModal.mobile],
                    ['Registered Address', detailModal.address || 'Chennai, Tamil Nadu'],
                    ['Active Service', detailModal.service || 'Accounts & Tax Audit'],
                    ['Account Status', detailModal.status],
                    ['Registration Date', detailModal.joinDate || '2025-01-10'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-slate-50 text-xs">
                      <span className="text-slate-400 uppercase font-semibold">{label}</span>
                      <span className="font-bold text-slate-700">{val}</span>
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
              <h3 className="font-bold text-slate-800 text-lg">{modal === 'add' ? 'Add Enterprise Client' : 'Edit Client Details'}</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Company / Organization Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sri Tech Solutions"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Contact Mobile *</label>
                  <input
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                  <select
                    value={form.assignedStaffId}
                    onChange={e => setForm({ ...form, assignedStaffId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.staffId || s.id}>{s.name} ({s.staffId})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Service / Package</label>
                <input
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  placeholder="e.g. GST Filing & Corporate Audit"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Address / Location</label>
                <input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Office address"
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
