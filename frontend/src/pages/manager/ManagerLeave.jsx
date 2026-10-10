import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_LEAVES } from '../../data/dummyData.jsx';
import { Plus, X, CheckCircle, XCircle } from 'lucide-react';
// toast handled via local state

const LEAVE_TYPES = ['Sick Leave','Casual Leave','Annual Leave','Emergency Leave'];

function Toast({ msg, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-bounce">
      {msg}<button onClick={onClose}><X size={14}/></button>
    </div>
  );
}

export default function ManagerLeave() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role==='staff' && u.managerId===mId);

  const [tab, setTab] = useState('staff');
  const [staffLeaves, setStaffLeaves] = useState(DUMMY_LEAVES.filter(l => myStaff.find(s=>s.id===l.staffId)));
  const [myLeaves, setMyLeaves] = useState(DUMMY_LEAVES.filter(l=>l.staffId===user?.id).slice(0,2));
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [form, setForm] = useState({ type:'Sick Leave', from:'', to:'', reason:'' });

  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(()=>setToastMsg(''),3000); };

  const handleApprove = (id) => {
    setStaffLeaves(prev => prev.map(l => l.id===id ? {...l, status:'approved'} : l));
    showToast('✅ Leave approved!');
  };

  const openReject = (leave) => { setRejectReason(''); setRejectModal(leave); };

  const confirmReject = () => {
    if (!rejectReason.trim()) { showToast('⚠️ Enter rejection reason'); return; }
    setStaffLeaves(prev => prev.map(l => l.id===rejectModal.id ? {...l, status:'rejected', rejectReason} : l));
    setRejectModal(null);
    showToast('❌ Leave rejected. Reason sent to staff.');
  };

  const submitLeave = () => {
    if (!form.from || !form.to || !form.reason) { showToast('Please fill all fields'); return; }
    const newLeave = { id:`l${Date.now()}`, staffId:user?.id, staffName:user?.name, leaveType:form.type, fromDate:form.from, toDate:form.to, reason:form.reason, status:'pending', appliedOn:new Date().toISOString().split('T')[0] };
    setMyLeaves(prev=>[newLeave,...prev]);
    setForm({type:'Sick Leave',from:'',to:'',reason:''});
    setShowModal(false);
    showToast('✅ Leave request submitted!');
  };

  const displayed = tab==='staff' ? (filter==='all'?staffLeaves:staffLeaves.filter(l=>l.status===filter)) : myLeaves;
  const badgeColor = s => s==='approved'?'bg-green-100 text-green-700':s==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';

  return (
    <DashboardLayout title="Leave Management">
      {toastMsg && <Toast msg={toastMsg} onClose={()=>setToastMsg('')}/>}

      {/* Tabs */}
      <div className="flex gap-3 mb-5">
        <button onClick={()=>setTab('staff')} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${tab==='staff'?'bg-purple-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
          Staff Leave Requests {staffLeaves.filter(l=>l.status==='pending').length>0&&<span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 rounded-full">{staffLeaves.filter(l=>l.status==='pending').length}</span>}
        </button>
        <button onClick={()=>setTab('my')} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${tab==='my'?'bg-purple-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>My Leave</button>
      </div>

      {tab==='staff' && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-4">
            {['all','pending','approved','rejected'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${filter===f?'bg-purple-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f}</button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {displayed.map(l => (
              <div key={l.id} className="px-5 py-4 flex flex-wrap items-center gap-3 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{l.staffName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{l.leaveType} · {l.fromDate} → {l.toDate}</p>
                  <p className="text-xs text-slate-400 italic mt-0.5">"{l.reason}"</p>
                  {l.rejectReason && <p className="text-xs text-red-500 mt-0.5">❌ Reason: {l.rejectReason}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${badgeColor(l.status)}`}>{l.status}</span>
                {l.status==='pending' && (
                  <div className="flex gap-2">
                    <button onClick={()=>handleApprove(l.id)} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-200">
                      <CheckCircle size={13}/> Approve
                    </button>
                    <button onClick={()=>openReject(l)} className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-200">
                      <XCircle size={13}/> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {displayed.length===0 && <p className="text-center py-8 text-slate-400 text-sm">No records found</p>}
          </div>
        </>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 mb-1">Reject Leave Request</h3>
            <p className="text-xs text-slate-400 mb-4">{rejectModal.staffName} — {rejectModal.leaveType} ({rejectModal.fromDate} → {rejectModal.toDate})</p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-xs text-red-600">
              ⚠️ This reason will be sent to the staff member.
            </div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Rejection Reason *</label>
            <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={3}
              placeholder="e.g. Critical deadline / Insufficient balance / Please reschedule..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"/>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setRejectModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={confirmReject} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">Send Rejection</button>
            </div>
          </div>
        </div>
      )}

      {tab==='my' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800">
              <Plus size={15}/> Apply Leave
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {myLeaves.map(l=>(
              <div key={l.id} className="px-5 py-4 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-800">{l.leaveType}</p>
                  <p className="text-xs text-slate-500">{l.fromDate} → {l.toDate} · {l.reason}</p>
                  <p className="text-xs text-slate-400">Applied: {l.appliedOn}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${badgeColor(l.status)}`}>{l.status}</span>
              </div>
            ))}
            {myLeaves.length===0 && <p className="text-center py-8 text-slate-400 text-sm">No leave history</p>}
          </div>
        </>
      )}

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">Apply for Leave</h3>
              <button onClick={()=>setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Leave Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  {LEAVE_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">From</label>
                  <input type="date" value={form.from} onChange={e=>setForm(f=>({...f,from:e.target.value}))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">To</label>
                  <input type="date" value={form.to} onChange={e=>setForm(f=>({...f,to:e.target.value}))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Reason</label>
                <textarea value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} rows={3}
                  placeholder="Enter reason..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">Cancel</button>
              <button onClick={submitLeave} className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-bold hover:bg-purple-800">Submit</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
