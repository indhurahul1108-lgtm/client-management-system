import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_ATTENDANCE, DUMMY_LEAVES, DUMMY_SALARIES } from '../../data/dummyData.jsx';
import { Search, Plus, X, UserCheck, UserX } from 'lucide-react';

const MONTHS3 = (() => {
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
  }
  return months;
})();

function Toast({ msg }) {
  return <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">{msg}</div>;
}

export default function ManageManagers() {
  const [managers, setManagers] = useState(DUMMY_USERS.filter(u => u.role === 'manager'));
  const [search, setSearch]     = useState('');
  const [detail, setDetail]     = useState(null);
  const [detailTab, setDetailTab] = useState('profile');
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState('');
  const [addForm, setAddForm]   = useState({ name:'', mobile:'', password:'', department:'', designation:'' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const toggleStatus = (id) => {
    setManagers(prev => prev.map(m => m.id===id ? {...m, status: m.status==='active'?'inactive':'active'} : m));
    showToast('✅ Status updated!');
  };

  const addManager = () => {
    if (!addForm.name || !addForm.mobile) { showToast('⚠️ Name & Mobile required'); return; }
    const newId = `m${String(managers.length + 3).padStart(3,'0')}`;
    const newM = {
      id: `u${Date.now()}`, role:'manager', name:addForm.name, mobile:addForm.mobile,
      password:addForm.password, department:addForm.department, designation:addForm.designation,
      status:'active', managerId: newId,
      joinDate: new Date().toISOString().split('T')[0],
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(addForm.name)}&background=7c3aed&color=fff&size=128`,
      address: 'Chennai',
    };
    setManagers(prev => [newM, ...prev]);
    setAddForm({ name:'', mobile:'', password:'', department:'', designation:'' });
    setShowAdd(false);
    showToast('✅ Manager added!');
  };

  const openDetail = (m) => { setDetail(m); setDetailTab('profile'); };

  const filtered = managers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || (m.mobile||'').includes(search)
  );

  // Get 3-month data for selected manager
  const getAttendance = (m) => DUMMY_ATTENDANCE.filter(a => a.userId === m.id).slice(0, 20);
  const getLeaves     = (m) => DUMMY_LEAVES.filter(l => l.staffId === m.id);
  const getSalaries   = (m) => DUMMY_SALARIES.filter(s => s.staffId === m.id || s.staffName === m.name);
  const getStaff      = (m) => DUMMY_USERS.filter(u => u.role==='staff' && u.managerId === m.managerId);

  return (
    <DashboardLayout title="Managers">
      {toast && <Toast msg={toast} />}

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search managers..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"/>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800">
          <Plus size={15}/> Add Manager
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Total', managers.length, 'purple'],['Active', managers.filter(m=>m.status==='active').length,'green'],['Inactive',managers.filter(m=>m.status==='inactive').length,'red']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${c}-700`}>{v}</p>
            <p className="text-xs text-slate-500 mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Managers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => {
          const myStaff   = DUMMY_USERS.filter(u => u.role==='staff' && u.managerId===m.managerId);
          const myClients = DUMMY_USERS.filter(u => u.role==='client' && myStaff.some(s => s.staffId===u.assignedStaffId));
          return (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:border-purple-100 transition">
              <div className="flex items-center gap-4 mb-4">
                <img src={m.photo} alt="" className="w-14 h-14 rounded-2xl object-cover"/>
                <div className="flex-1 min-w-0">
                  {/* Click name → detail */}
                  <button onClick={() => openDetail(m)} className="font-bold text-slate-800 text-left hover:text-purple-700 transition truncate block w-full">
                    {m.name}
                  </button>
                  <p className="text-xs text-slate-400">{m.managerId?.toUpperCase()} · {m.designation||'Manager'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${m.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{m.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {[['Staff', myStaff.length],['Clients',myClients.length],['Dept.',m.department||'—']].map(([l,v])=>(
                  <div key={l} className="bg-slate-50 rounded-xl p-2">
                    <p className="text-sm font-bold text-slate-700">{v}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openDetail(m)} className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100">View Details</button>
                <button onClick={() => toggleStatus(m.id)} className={`px-3 py-2 rounded-xl text-xs font-bold ${m.status==='active'?'bg-red-50 text-red-600 hover:bg-red-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {m.status==='active'?'Deactivate':'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Modal (3-month view) ─────────────────────── */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 text-white">
              <div className="flex items-center gap-4">
                <img src={detail.photo} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"/>
                <div>
                  <h3 className="font-bold text-lg">{detail.name}</h3>
                  <p className="text-purple-200 text-sm">{detail.managerId?.toUpperCase()} · {detail.department||'—'}</p>
                </div>
                <button onClick={() => setDetail(null)} className="ml-auto bg-white/20 rounded-xl p-2"><X size={16}/></button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-5 pt-3 gap-1 overflow-x-auto">
              {['profile','attendance','leave','salary','staff'].map(t => (
                <button key={t} onClick={() => setDetailTab(t)}
                  className={`px-3 py-2 text-xs font-semibold capitalize whitespace-nowrap rounded-t-lg transition ${detailTab===t?'bg-purple-50 text-purple-700 border-b-2 border-purple-600':'text-slate-400 hover:text-slate-600'}`}>{t}</button>
              ))}
            </div>

            <div className="overflow-y-auto p-5" style={{ maxHeight: '55vh' }}>
              {detailTab==='profile' && (
                <div className="space-y-3">
                  {[['Mobile',detail.mobile],['Address',detail.address||'—'],['Department',detail.department||'—'],['Designation',detail.designation||'—'],['Join Date',detail.joinDate],['Status',detail.status]].map(([l,v])=>(
                    <div key={l} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                      <span className="text-slate-400 text-xs font-semibold uppercase">{l}</span>
                      <span className="font-medium text-slate-700 capitalize">{v||'—'}</span>
                    </div>
                  ))}
                </div>
              )}
              {detailTab==='attendance' && (
                <div>
                  <p className="text-xs text-slate-400 mb-3">Last 3 months attendance</p>
                  {getAttendance(detail).length ? getAttendance(detail).map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 text-sm">
                      <span className="text-xs text-slate-500">{a.date}</span>
                      <div className="text-xs text-slate-500">{a.punchIn||'—'} → {a.punchOut||'—'}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${a.status==='present'?'bg-green-100 text-green-700':a.status==='late'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{a.status}</span>
                    </div>
                  )) : <p className="text-slate-400 text-sm text-center py-6">No attendance records found</p>}
                </div>
              )}
              {detailTab==='leave' && (
                <div>
                  {getLeaves(detail).length ? getLeaves(detail).map(l => (
                    <div key={l.id} className="py-3 border-b border-slate-50">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-slate-700">{l.leaveType}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${l.status==='approved'?'bg-green-100 text-green-700':l.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{l.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{l.fromDate} → {l.toDate}</p>
                      <p className="text-xs text-slate-400 italic">"{l.reason}"</p>
                    </div>
                  )) : <p className="text-slate-400 text-sm text-center py-6">No leave records found</p>}
                </div>
              )}
              {detailTab==='salary' && (
                <div>
                  {getSalaries(detail).length ? getSalaries(detail).map(s => {
                    const net = s.netSalary || (s.basic + s.allowance - s.deduction);
                    return (
                      <div key={s.id} className="py-3 border-b border-slate-50 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{s.month}</p>
                          <p className="text-xs text-slate-400">Basic: ₹{s.basic?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">₹{net.toLocaleString('en-IN')}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                        </div>
                      </div>
                    );
                  }) : <p className="text-slate-400 text-sm text-center py-6">No salary records</p>}
                </div>
              )}
              {detailTab==='staff' && (
                <div>
                  <p className="text-xs text-slate-400 mb-3">Staff under this manager</p>
                  {getStaff(detail).map(s => (
                    <div key={s.id} className="flex items-center gap-3 py-3 border-b border-slate-50">
                      <img src={s.photo} alt="" className="w-9 h-9 rounded-xl object-cover"/>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.staffId} · {s.designation||'Staff'}</p>
                      </div>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${s.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{s.status}</span>
                    </div>
                  ))}
                  {getStaff(detail).length === 0 && <p className="text-slate-400 text-sm text-center py-6">No staff assigned</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Manager Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">Add New Manager</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              {[['Full Name *','name','text'],['Mobile Number *','mobile','tel'],['Password *','password','password'],['Department','department','text'],['Designation','designation','text']].map(([label,key,type]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">{label}</label>
                  <input type={type} value={addForm[key]} onChange={e => setAddForm(p => ({...p,[key]:e.target.value}))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={addManager} className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-bold hover:bg-purple-800">Add Manager</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
