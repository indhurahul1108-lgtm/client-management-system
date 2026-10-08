import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Search, X, Eye, UserCheck, UserX } from 'lucide-react';

const ROLE_COLOR  = { admin:'bg-blue-100 text-blue-700', manager:'bg-purple-100 text-purple-700', staff:'bg-green-100 text-green-700', client:'bg-orange-100 text-orange-700' };
const ROLE_BADGE  = { admin:'👑 Admin', manager:'🟣 Manager', staff:'🟢 Staff', client:'🟠 Client' };

export default function UserManagement() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [detail, setDetail]     = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [addForm, setAddForm]   = useState({ name:'', mobile:'', password:'', role:'staff' });

  const showToast = msg => { setToastMsg(msg); setTimeout(()=>setToastMsg(''),3000); };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id===id ? {...u, status: u.status==='active'?'inactive':'active'} : u));
    showToast('✅ User status updated!');
  };

  const addUser = () => {
    if (!addForm.name || !addForm.mobile) { showToast('⚠️ Name and Mobile required'); return; }
    const newUser = { id:`u${Date.now()}`, ...addForm, status:'active', joinDate:new Date().toISOString().split('T')[0], photo:`https://ui-avatars.com/api/?name=${encodeURIComponent(addForm.name)}&background=random&size=128` };
    setUsers(prev=>[newUser,...prev]);
    setAddForm({name:'',mobile:'',password:'',role:'staff'});
    setShowAdd(false);
    showToast('✅ User added!');
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || (u.mobile||'').includes(search) || (u.role||'').includes(search);
    const matchRole   = roleFilter==='all' || u.role===roleFilter;
    const matchStatus = statusFilter==='all' || u.status===statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = { admin:users.filter(u=>u.role==='admin').length, manager:users.filter(u=>u.role==='manager').length, staff:users.filter(u=>u.role==='staff').length, client:users.filter(u=>u.role==='client').length, active:users.filter(u=>u.status==='active').length, inactive:users.filter(u=>u.status==='inactive').length };

  return (
    <DashboardLayout title="User Management">
      {toastMsg&&<div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">{toastMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[['Total',users.length,'slate'],['Managers',counts.manager,'purple'],['Staff',counts.staff,'green'],['Clients',counts.client,'orange'],['Active',counts.active,'green'],['Inactive',counts.inactive,'red']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-3 text-center`}>
            <p className={`text-xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-400">{l}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, mobile, role..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"/>
        </div>
        <select value={roleFilter} onChange={e=>setRole(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="all">All Roles</option>
          {['admin','manager','staff','client'].map(r=><option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
        <select value={statusFilter} onChange={e=>setStatus(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={()=>setShowAdd(true)} className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800">+ Add User</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>{['User','Mobile','Role','Status','Joined','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u=>(
                <tr key={u.id} className={`hover:bg-slate-50 transition ${u.status==='inactive'?'opacity-60':''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.photo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                      <div><p className="font-semibold text-slate-700 text-xs">{u.name}</p><p className="text-xs text-slate-400">{u.staffId||u.clientId||u.managerId||u.id}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{u.mobile||'—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${ROLE_COLOR[u.role]||'bg-slate-100 text-slate-600'}`}>{ROLE_BADGE[u.role]||u.role}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${u.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{u.status}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.joinDate||'—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>setDetail(u)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100" title="View"><Eye size={13}/></button>
                      <button onClick={()=>toggleStatus(u.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 ${u.status==='active'?'bg-red-50 text-red-600':'bg-green-50 text-green-600'}`} title={u.status==='active'?'Deactivate':'Activate'}>
                        {u.status==='active'?<UserX size={13}/>:<UserCheck size={13}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<p className="text-center py-8 text-slate-400 text-sm">No users found</p>}
      </div>

      {/* Detail Modal */}
      {detail&&(
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <img src={detail.photo} alt="" className="w-16 h-16 rounded-xl object-cover"/>
              <div><h3 className="font-bold text-slate-800">{detail.name}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${ROLE_COLOR[detail.role]}`}>{ROLE_BADGE[detail.role]}</span>
              </div>
              <button onClick={()=>setDetail(null)} className="ml-auto text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            {[['Mobile',detail.mobile],['Address',detail.address],['Status',detail.status],['Joined',detail.joinDate],['ID',detail.staffId||detail.clientId||detail.managerId||detail.id]].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                <span className="text-slate-400 text-xs font-semibold uppercase">{l}</span>
                <span className="font-medium text-slate-700 capitalize">{v||'—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd&&(
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">Add New User</h3>
              <button onClick={()=>setShowAdd(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              {[{label:'Full Name *',key:'name',type:'text'},{label:'Mobile Number *',key:'mobile',type:'tel'},{label:'Password *',key:'password',type:'password'}].map(f=>(
                <div key={f.key}><label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">{f.label}</label>
                  <input type={f.type} value={addForm[f.key]} onChange={e=>setAddForm(p=>({...p,[f.key]:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
              ))}
              <div><label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Role</label>
                <select value={addForm.role} onChange={e=>setAddForm(p=>({...p,role:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {['manager','staff','client'].map(r=><option key={r} value={r} className="capitalize">{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={addUser} className="flex-1 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-800">Add User</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
