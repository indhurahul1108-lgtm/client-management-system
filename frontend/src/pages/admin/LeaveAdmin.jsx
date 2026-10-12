import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { DUMMY_LEAVES, DUMMY_USERS } from '../../data/dummyData.jsx';
import { Check, X, MessageSquare, CheckCircle, Users, UserCheck, Building2, Calendar } from 'lucide-react';

function Badge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-600',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

function Toast({ msg, color }) {
  return <div className={`fixed top-4 right-4 z-50 ${color} text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold`}>{msg}</div>;
}

// Generate realistic role-separated leave records (Managers, Staff, Candidates/Clients)
const INITIAL_LEAVES = [
  // ── 1. MANAGERS LEAVES ──
  { id: 'l_m1', staffId: 'u002', staffName: 'Priya Nair', role: 'manager', leaveType: 'Casual Leave', fromDate: '2026-10-18', toDate: '2026-10-19', reason: 'Family Function & Travel', status: 'pending', appliedOn: '2026-10-10' },
  { id: 'l_m2', staffId: 'u003', staffName: 'Karthik Raja', role: 'manager', leaveType: 'Annual Leave', fromDate: '2026-10-25', toDate: '2026-10-28', reason: 'Personal Leave', status: 'approved', appliedOn: '2026-10-05', approvalMessage: 'Approved. Assistant manager handling duties.' },

  // ── 2. STAFF LEAVES ──
  { id: 'l_s1', staffId: 'u004', staffName: 'Anitha Devi', role: 'staff', leaveType: 'Sick Leave', fromDate: '2026-10-10', toDate: '2026-10-11', reason: 'Fever and cold', status: 'pending', appliedOn: '2026-10-08' },
  { id: 'l_s2', staffId: 'u005', staffName: 'Murugan P', role: 'staff', leaveType: 'Casual Leave', fromDate: '2026-10-15', toDate: '2026-10-15', reason: 'Personal work', status: 'approved', appliedOn: '2026-10-09' },
  { id: 'l_s3', staffId: 'u006', staffName: 'Deepa S', role: 'staff', leaveType: 'Annual Leave', fromDate: '2026-10-20', toDate: '2026-10-23', reason: 'Family function', status: 'approved', appliedOn: '2026-10-07' },
  { id: 'l_s4', staffId: 'u007', staffName: 'Ravi Kumar', role: 'staff', leaveType: 'Sick Leave', fromDate: '2026-10-05', toDate: '2026-10-06', reason: 'Doctor visit', status: 'rejected', appliedOn: '2026-10-04', rejectReason: 'Shift critical coverage pending' },
  { id: 'l_s5', staffId: 'u008', staffName: 'Lavanya M', role: 'staff', leaveType: 'Casual Leave', fromDate: '2026-10-25', toDate: '2026-10-25', reason: 'Personal emergency', status: 'pending', appliedOn: '2026-10-10' },

  // ── 3. CLIENTS / DEPLOYED CANDIDATES LEAVES ──
  { id: 'l_c1', staffId: 'u014', staffName: 'Karthik Velu', role: 'client', leaveType: 'Casual Leave', fromDate: '2026-10-12', toDate: '2026-10-13', reason: 'Native village trip', status: 'pending', appliedOn: '2026-10-09', assignedBunk: 'IOCL Anna Salai' },
  { id: 'l_c2', staffId: 'u015', staffName: 'Saravanan M', role: 'client', leaveType: 'Sick Leave', fromDate: '2026-10-14', toDate: '2026-10-14', reason: 'Doctor checkup', status: 'approved', appliedOn: '2026-10-08', assignedBunk: 'BPCL Guindy' },
  { id: 'l_c3', staffId: 'u016', staffName: 'Prakash R', role: 'client', leaveType: 'Emergency Leave', fromDate: '2026-10-16', toDate: '2026-10-17', reason: 'Family urgent matter', status: 'pending', appliedOn: '2026-10-10', assignedBunk: 'HPCL OMR' },
  { id: 'l_c4', staffId: 'u017', staffName: 'Dinesh Kumar', role: 'client', leaveType: 'Medical Leave', fromDate: '2026-10-22', toDate: '2026-10-22', reason: 'Hospital visit', status: 'approved', appliedOn: '2026-10-06', assignedBunk: 'Shell Sholinganallur' },
];

export default function LeaveAdmin() {
  const { lang } = useLanguage();
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  const [roleTab, setRoleTab] = useState('all'); // 'all' | 'manager' | 'staff' | 'client'
  const [filter, setFilter] = useState('all');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveModal, setApproveModal] = useState(null);
  const [approveMessage, setApproveMessage] = useState('Approved by Management.');
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = 'bg-green-600') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const openApprove = (leave) => {
    setApproveMessage(`Approved by Admin. Replacement shift arranged for ${leave.staffName}.`);
    setApproveModal(leave);
  };

  const confirmApprove = () => {
    setLeaves(prev => prev.map(l => l.id === approveModal.id
      ? { ...l, status: 'approved', approvalMessage: approveMessage || 'Approved' }
      : l
    ));
    setApproveModal(null);
    showToast(`✅ ${approveModal.staffName} விடுப்பு ஒப்புதல் அளிக்கப்பட்டது!`);
  };

  const openReject = (leave) => {
    setRejectReason('');
    setRejectModal(leave);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) { showToast('⚠️ காரணம் குறிப்பிடவும்', 'bg-red-500'); return; }
    setLeaves(prev => prev.map(l => l.id === rejectModal.id
      ? { ...l, status: 'rejected', rejectReason }
      : l
    ));
    setRejectModal(null);
    showToast(`❌ ${rejectModal.staffName} விடுப்பு நிராகரிக்கப்பட்டது.`);
  };

  const filtered = leaves.filter(l => {
    const matchRole = roleTab === 'all' || l.role === roleTab;
    const matchStatus = filter === 'all' || l.status === filter;
    return matchRole && matchStatus;
  });

  return (
    <DashboardLayout title={lang === 'ta' ? 'விடுப்பு மேலாண்மை (Leave Management)' : 'Leave Management'}>
      {toast && <Toast msg={toast.msg} color={toast.color} />}

      {/* ── Separate Role Selection Tabs (Manager, Staff, Clients) ── */}
      <div className="bg-white rounded-2xl p-2 mb-5 border border-slate-200/80 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'all',     label: lang === 'ta' ? 'அனைத்து விடுப்புகள் (All)' : 'All Leaves', icon: Users, color: 'bg-slate-900 text-white' },
          { id: 'manager', label: lang === 'ta' ? 'மேலாளர்கள் விடுப்பு (Managers)' : 'Managers Leaves', icon: UserCheck, color: 'bg-purple-700 text-white' },
          { id: 'staff',   label: lang === 'ta' ? 'ஸ்டாஃப் விடுப்பு (Staff)' : 'Staff Leaves', icon: Users, color: 'bg-green-700 text-white' },
          { id: 'client',  label: lang === 'ta' ? 'பங்க் பணியாளர்கள் விடுப்பு (Clients / Workers)' : 'Clients / Bunk Workers', icon: Building2, color: 'bg-orange-600 text-white' },
        ].map(tab => {
          const Icon = tab.icon;
          const active = roleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRoleTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                active ? tab.color : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {leaves.filter(l => tab.id === 'all' || l.role === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Pending',  filtered.filter(l => l.status === 'pending').length,  'yellow'],
          ['Approved', filtered.filter(l => l.status === 'approved').length, 'green'],
          ['Rejected', filtered.filter(l => l.status === 'rejected').length, 'red'],
          ['Selected Applications', filtered.length,                          'blue'],
        ].map(([label, count, c]) => (
          <div key={label} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${c}-700`}>{count}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter status tabs */}
        <div className="px-5 py-4 border-b border-slate-100 flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                ${filter === f ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f} ({f === 'all' ? filtered.length : filtered.filter(l => l.status === f).length})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Person Name', 'Category', 'Leave Type', 'From Date', 'To Date', 'Reason & Details', 'Applied Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        l.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                        l.role === 'staff' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {l.staffName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{l.staffName}</p>
                        {l.assignedBunk && <p className="text-[10px] text-slate-400">{l.assignedBunk}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      l.role === 'manager' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      l.role === 'staff' ? 'bg-green-50 text-green-700 border border-green-200' :
                      'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {l.role === 'manager' ? 'Manager' : l.role === 'staff' ? 'Staff' : 'Candidate (Client)'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                    {l.leaveType}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">{l.fromDate}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">{l.toDate}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[220px]">
                    <p className="italic font-medium">"{l.reason}"</p>
                    {l.approvalMessage && (
                      <p className="text-[11px] text-green-700 font-semibold mt-1">✓ Note: {l.approvalMessage}</p>
                    )}
                    {l.rejectReason && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">✗ Reason: {l.rejectReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">{l.appliedOn || '—'}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge status={l.status} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {l.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openApprove(l)}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-700 shadow-sm"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => openReject(l)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-200"
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No leave applications found</div>}
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 text-base mb-1">Approve Leave</h3>
            <p className="text-xs text-slate-500 mb-4">{approveModal.staffName} ({approveModal.leaveType}: {approveModal.fromDate} to {approveModal.toDate})</p>
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Management Approval Note</label>
              <textarea
                value={approveMessage}
                onChange={e => setApproveMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setApproveModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold">Cancel</button>
              <button onClick={confirmApprove} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">Confirm Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 text-base mb-1">Reject Leave Application</h3>
            <p className="text-xs text-slate-500 mb-4">{rejectModal.staffName} ({rejectModal.leaveType})</p>
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Rejection Reason *</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Reason for rejecting leave..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-400 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold">Cancel</button>
              <button onClick={confirmReject} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
