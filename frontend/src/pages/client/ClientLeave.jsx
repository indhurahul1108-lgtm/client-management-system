import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { printIndividualRecord } from '../../utils/printUtils.js';
import PhoneCallModal from '../../components/PhoneCallModal';
import { FileText, Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, Phone, User, Printer, ShieldCheck } from 'lucide-react';

const INITIAL_CLIENT_LEAVES = [
  {
    id: 'cleave_1',
    leaveType: 'Casual Leave',
    fromDate: '2026-10-12',
    toDate: '2026-10-13',
    reason: 'Native village trip for family temple function',
    status: 'pending',
    appliedOn: '2026-10-09',
    approvalMessage: null,
  },
  {
    id: 'cleave_2',
    leaveType: 'Sick Leave',
    fromDate: '2026-09-20',
    toDate: '2026-09-20',
    reason: 'Fever and doctor visit',
    status: 'approved',
    appliedOn: '2026-09-19',
    approvalMessage: 'Approved by Manager Priya Nair. Reliever staff posted on shift.',
  },
  {
    id: 'cleave_3',
    leaveType: 'Emergency Leave',
    fromDate: '2026-08-15',
    toDate: '2026-08-15',
    reason: 'Personal urgent family work',
    status: 'approved',
    appliedOn: '2026-08-14',
    approvalMessage: 'Approved by Management.',
  },
];

export default function ClientLeave() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState(INITIAL_CLIENT_LEAVES);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [callingContact, setCallingContact] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [toast, setToast] = useState('');

  // Primary supervising staff
  const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
  const assignedStaffIds = user?.assignedStaffIds || (user?.assignedStaffId ? [user.assignedStaffId] : ['s001']);
  const assignedStaffMembers = staffList.filter(s => assignedStaffIds.includes(s.staffId || s.id));
  const primaryStaff = assignedStaffMembers[0] || { name: 'Anitha Devi', mobile: '9000000004' };

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason.trim()) {
      showToastMsg('⚠️ Please fill in From Date, To Date, and Reason');
      return;
    }

    const newLeave = {
      id: `cleave_${Date.now()}`,
      leaveType: leaveForm.leaveType,
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      reason: leaveForm.reason.trim(),
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approvalMessage: null,
    };

    setLeaves([newLeave, ...leaves]);
    setShowApplyModal(false);
    setLeaveForm({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '' });
    showToastMsg('✅ Leave application submitted! Your supervisor has been notified.');
  };

  const handlePrintLeaveStatement = () => {
    printIndividualRecord({
      title: 'Candidate / Worker Official Leave Statement',
      person: {
        name: user?.name || 'Karthik Velu',
        staffId: user?.clientId || 'C001',
        mobile: user?.mobile || '9876543210',
        role: 'Client Candidate',
        roleAtBunk: user?.roleAtBunk || 'Fuel Dispenser Lead Attendant',
        assignedBunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)',
        shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'leaves',
      records: leaves,
    });
  };

  return (
    <DashboardLayout title="Request Leave">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* ── Top Header Banner ── */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white mb-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl shrink-0 backdrop-blur-sm">
            <FileText size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Leave Applications & Management Approval
            </h2>
            <p className="text-xs text-orange-100 mt-1 max-w-xl leading-relaxed">
              Submit your station duty leave requests in advance. Your field supervisor will arrange a relief attendant for your bunk shift.
            </p>
            <p className="text-xs text-amber-200 mt-2 font-semibold flex items-center gap-1.5">
              <User size={13} /> Supervising Staff: {primaryStaff.name} (📞 {primaryStaff.mobile})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow transition shrink-0"
          >
            <Plus size={16} /> Apply for Leave
          </button>
          <button
            onClick={handlePrintLeaveStatement}
            className="flex items-center gap-2 bg-orange-800/60 hover:bg-orange-800 border border-white/20 text-white px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shrink-0"
          >
            <Printer size={16} /> Print Leave Record
          </button>
        </div>
      </div>

      {/* ── Leave Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Applications</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{leaves.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Recorded to date</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-emerald-700 font-medium">Approved Leaves</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {leaves.filter(l => l.status === 'approved').length}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Shift relief confirmed</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-amber-700 font-medium">Pending Review</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {leaves.filter(l => l.status === 'pending').length}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting manager note</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-blue-700 font-medium">Station Shift Status</p>
          <p className="text-base font-black text-blue-800 mt-1 flex items-center gap-1.5">
            <Clock size={16} /> On Duty Regular
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Morning Shift</p>
        </div>
      </div>

      {/* ── Leaves Table ── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-orange-600" />
              <span>Leave Application History & Status</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved leaves show supervisor reliever details and management clearance notes
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">From Date</th>
                <th className="p-3 text-left">To Date</th>
                <th className="p-3 text-left">Reason & Notes</th>
                <th className="p-3 text-left">Applied Date</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800">{l.leaveType}</td>
                  <td className="p-3 font-mono text-slate-700">{l.fromDate}</td>
                  <td className="p-3 font-mono text-slate-700">{l.toDate}</td>
                  <td className="p-3 max-w-xs text-slate-600">
                    <p className="font-medium italic">"{l.reason}"</p>
                    {l.approvalMessage && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">
                        ✓ Note: {l.approvalMessage}
                      </p>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{l.appliedOn}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      l.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {l.status === 'approved' ? <CheckCircle size={12} /> :
                       l.status === 'rejected' ? <XCircle size={12} /> : <AlertCircle size={12} />}
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Emergency Leave Notice ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-700" />
            <span>Emergency Shift Leave Policy</span>
          </h4>
          <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
            In case of sudden illness or urgent personal emergencies, call your supervising staff immediately so that another candidate from the standby crew can be deployed to your fuel dispenser station.
          </p>
        </div>
        <button
          onClick={() => setCallingContact({
            name: primaryStaff.name,
            role: 'Field Supervising Staff',
            mobile: primaryStaff.mobile,
            photo: primaryStaff.photo,
            bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'
          })}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition shrink-0"
        >
          <Phone size={14} />
          <span>Call Staff ({primaryStaff.name})</span>
        </button>
      </div>

      {/* ── Phone Call Modal ── */}
      <PhoneCallModal
        isOpen={!!callingContact}
        onClose={() => setCallingContact(null)}
        contact={callingContact}
      />

      {/* ── Apply Modal ── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-slate-800 text-base mb-1">Apply for Station Leave</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your leave dates and simple reason for supervisor approval.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="Casual Leave">Casual Leave (Personal / Family Work)</option>
                  <option value="Sick Leave">Sick Leave (Fever / Health Issue)</option>
                  <option value="Medical Leave">Medical Leave (Doctor Appointment / Hospital)</option>
                  <option value="Emergency Leave">Emergency Leave (Urgent Native Travel)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">From Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.fromDate}
                    onChange={e => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">To Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.toDate}
                    onChange={e => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="E.g., Native village temple function or doctor visit..."
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
