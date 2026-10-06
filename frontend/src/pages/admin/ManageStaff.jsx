import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_MANAGERS } from '../../data/dummyData.jsx';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, Users } from 'lucide-react';

const managerList    = DUMMY_MANAGERS;
const initialStaff   = DUMMY_USERS.filter(u => u.role === 'staff');

const emptyForm = { name: '', mobile: '', address: '', managerId: '', status: 'active', salary: '', joiningDate: new Date().toISOString().split('T')[0] };

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {status}
    </span>
  );
}

export default function ManageStaff() {
  const [staff,        setStaff]        = useState(initialStaff);
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal,        setModal]        = useState(false);
  const [form,         setForm]         = useState(emptyForm);
  const [editId,       setEditId]       = useState(null);
  const [deleteConfirm,setDeleteConfirm]= useState(null);
  const [toast,        setToast]        = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = (s) => {
    setForm({ name: s.name, mobile: s.mobile, address: s.address || '', managerId: s.managerId || '',
              status: s.status, salary: s.salary || '', joiningDate: s.joiningDate || '' });
    setEditId(s.id);
    setModal('edit');
  };

  const toggleStatus = (id) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const deleteStaff = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    showToast('🗑️ Staff removed successfully!');
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) { showToast('Name and Mobile are required!'); return; }
    if (form.mobile.length !== 10)  { showToast('Mobile must be 10 digits!'); return; }

    if (modal === 'add') {
      const newStaff = {
        ...emptyForm, ...form,
        id:       `s_${Date.now()}`,
        role:     'staff',
        staffId:  `st${(staff.length + 11).toString().padStart(3, '0')}`,
        photo:    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=3b82f6&color=fff&size=128`,
        password: 'staff123',
      };
      setStaff(prev => [newStaff, ...prev]);
      showToast('✅ Staff added successfully!');
    } else {
      setStaff(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
      showToast('✅ Staff updated successfully!');
    }
    setModal(false);
  };

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Staff Management">

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm">
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center"><Users size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-blue-800">{staff.length}</p><p className="text-sm text-blue-600 font-medium">Total Staff</p></div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center"><Users size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-green-800">{staff.filter(s => s.status === 'active').length}</p><p className="text-sm text-green-600 font-medium">Active</p></div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center"><Users size={20} className="text-white" /></div>
          <div><p className="text-2xl font-bold text-red-800">{staff.filter(s => s.status === 'inactive').length}</p><p className="text-sm text-red-600 font-medium">Inactive</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)}
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
            <Plus size={16} /> Add Staff
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Manager</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Join Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => {
                const mgr = managerList.find(m => m.id === s.managerId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div><p className="font-semibold text-slate-700">{s.name}</p><p className="text-xs text-slate-400">{s.staffId?.toUpperCase()}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{s.mobile}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{mgr?.name || s.manager || '—'}</td>
                    <td className="px-4 py-4 font-medium text-slate-700 text-xs">₹{Number(s.salary || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{s.joiningDate || '—'}</td>
                    <td className="px-4 py-4"><Badge status={s.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} title="Edit"
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleStatus(s.id)} title={s.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {s.status === 'active'
                            ? <ToggleRight size={22} className="text-green-500 hover:text-green-700 transition" />
                            : <ToggleLeft  size={22} className="text-slate-400 hover:text-slate-600 transition" />}
                        </button>
                        <button onClick={() => setDeleteConfirm(s)} title="Delete"
                          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No staff found</div>}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Remove Staff?</h3>
            <p className="text-slate-400 text-sm mb-6">Are you sure you want to remove <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={() => deleteStaff(deleteConfirm.id)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">{modal === 'add' ? '➕ Add New Staff' : '✏️ Edit Staff'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={16} /></button>
            </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Salary (₹)</label>
                  <input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="Monthly salary"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Joining Date</label>
                  <input type="date" value={form.joiningDate} onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Assign Manager</label>
                <select value={form.managerId} onChange={e => setForm(f => ({ ...f, managerId: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Manager —</option>
                  {managerList.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Address</label>
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} placeholder="Full address"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
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
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
                <Save size={15} /> {modal === 'add' ? 'Add Staff' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
