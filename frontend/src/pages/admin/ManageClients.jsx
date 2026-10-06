import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Search, Plus, Edit2, ToggleLeft, ToggleRight, X, Save, Building2, Phone, MapPin, User } from 'lucide-react';

const staffList   = DUMMY_USERS.filter(u => u.role === 'staff');
const initialClients = DUMMY_USERS.filter(u => u.role === 'client');

const emptyForm = { name: '', mobile: '', address: '', service: '', assignedStaffId: '', status: 'active', email: '', notes: '' };

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {status}
    </span>
  );
}

export default function ManageClients() {
  const [clients,     setClients]     = useState(initialClients);
  const [search,      setSearch]      = useState('');
  const [filterStatus,setFilterStatus]= useState('all');
  const [modal,       setModal]       = useState(false); // 'add' | 'edit' | false
  const [form,        setForm]        = useState(emptyForm);
  const [editId,      setEditId]      = useState(null);
  const [toast,       setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = (c) => {
    setForm({ name: c.name, mobile: c.mobile, address: c.address || '', service: c.service || '',
              assignedStaffId: c.assignedStaffId || '', status: c.status, email: c.email || '', notes: c.notes || '' });
    setEditId(c.id);
    setModal('edit');
  };

  const toggleStatus = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
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

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Client Management">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm animate-pulse">
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-orange-800">{clients.length}</p><p className="text-sm text-orange-600 font-medium">Total Clients</p></div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-green-800">{clients.filter(c => c.status === 'active').length}</p><p className="text-sm text-green-600 font-medium">Active</p></div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-red-800">{clients.filter(c => c.status === 'inactive').length}</p><p className="text-sm text-red-600 font-medium">Inactive</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={openAdd}
            className="ml-auto flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
            <Plus size={16} /> Add Client
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assigned Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => {
                const staff = staffList.find(s => s.staffId === c.assignedStaffId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div><p className="font-semibold text-slate-700">{c.name}</p><p className="text-xs text-slate-400">{c.clientId?.toUpperCase()}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap"><span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-300" />{c.mobile}</span></td>
                    <td className="px-4 py-4"><span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg">{c.service || '—'}</span></td>
                    <td className="px-4 py-4">
                      {staff ? (
                        <div className="flex items-center gap-2"><img src={staff.photo} className="w-6 h-6 rounded-lg object-cover" /><span className="text-xs font-medium text-slate-600">{staff.name}</span></div>
                      ) : <span className="text-slate-300 text-xs">Not assigned</span>}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs max-w-[130px] truncate">{c.address || '—'}</td>
                    <td className="px-4 py-4"><Badge status={c.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} title="Edit"
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleStatus(c.id)} title={c.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {c.status === 'active'
                            ? <ToggleRight size={22} className="text-green-500 hover:text-green-700 transition" />
                            : <ToggleLeft  size={22} className="text-slate-400 hover:text-slate-600 transition" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No clients found</div>}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">{modal === 'add' ? '➕ Add New Client' : '✏️ Edit Client'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={16} /></button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter name"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Mobile Number *</label>
                  <input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="10-digit mobile"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Service / Work Type</label>
                <input value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} placeholder="e.g., GST Filing, Audit"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Assign Staff</label>
                <select value={form.assignedStaffId} onChange={e => setForm(f => ({ ...f, assignedStaffId: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Not Assigned —</option>
                  {staffList.map(s => <option key={s.id} value={s.staffId}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Address</label>
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} placeholder="Full address"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Email (optional)</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Any additional notes..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
                <Save size={15} /> {modal === 'add' ? 'Add Client' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
