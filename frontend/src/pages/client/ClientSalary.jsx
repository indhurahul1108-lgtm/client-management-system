import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { printIndividualRecord } from '../../utils/printUtils.js';
import PhoneCallModal from '../../components/PhoneCallModal';
import { IndianRupee, Printer, ShieldCheck, CheckCircle, Clock, Building2, Phone, User, Users, Smartphone, CreditCard } from 'lucide-react';

const PAYSLIP_HISTORY = [
  {
    month: 'October 2026',
    basic: 16000,
    allowance: 2500,
    deduction: 0,
    netSalary: 18500,
    status: 'pending',
    paymentMethod: 'gpay',
    paidOn: null,
    workingDays: 26,
    presentDays: 26,
  },
  {
    month: 'September 2026',
    basic: 16000,
    allowance: 2500,
    deduction: 0,
    netSalary: 18500,
    status: 'paid',
    paymentMethod: 'bank',
    paidOn: '2026-10-05',
    workingDays: 26,
    presentDays: 26,
  },
  {
    month: 'August 2026',
    basic: 16000,
    allowance: 2500,
    deduction: 500,
    netSalary: 18000,
    status: 'paid',
    paymentMethod: 'gpay',
    paidOn: '2026-09-05',
    workingDays: 27,
    presentDays: 25,
  },
];

export default function ClientSalary() {
  const { user } = useAuth();
  const [callingContact, setCallingContact] = useState(null);

  // Assigned Staff & Manager
  const staffList = DUMMY_USERS.filter(u => u.role === 'staff');
  const assignedStaffIds = user?.assignedStaffIds || (user?.assignedStaffId ? [user.assignedStaffId] : ['s001']);
  const assignedStaffMembers = staffList.filter(s => assignedStaffIds.includes(s.staffId || s.id));
  const primaryStaff = assignedStaffMembers[0] || { name: 'Anitha Devi', mobile: '9000000004' };

  const currentSalary = user?.salary || 18500;
  const basicPay = currentSalary - 2500;
  const allowance = 2500;

  const handlePrintPayslip = (slip) => {
    printIndividualRecord({
      title: `Official Salary Statement & Payslip (${slip.month})`,
      person: {
        name: user?.name || 'Karthik Velu',
        staffId: user?.clientId || 'C001',
        mobile: user?.mobile || '9876543210',
        role: 'Client Candidate',
        roleAtBunk: user?.roleAtBunk || 'Fuel Dispenser Lead Attendant',
        assignedBunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)',
        shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'salary',
      records: [slip],
    });
  };

  const handlePrintAllPayslips = () => {
    printIndividualRecord({
      title: 'Candidate / Worker 3-Month Salary Statement',
      person: {
        name: user?.name || 'Karthik Velu',
        staffId: user?.clientId || 'C001',
        mobile: user?.mobile || '9876543210',
        role: 'Client Candidate',
        roleAtBunk: user?.roleAtBunk || 'Fuel Dispenser Lead Attendant',
        assignedBunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)',
        shift: user?.shift || 'Shift 1: Morning (06:00 AM - 02:00 PM)',
      },
      type: 'salary',
      records: PAYSLIP_HISTORY,
    });
  };

  return (
    <DashboardLayout title="My Salary & Payslips">
      {/* ── Top Header Banner ── */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white mb-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl shrink-0 backdrop-blur-sm">
            <IndianRupee size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Station Duty Salary & Verified Payslips
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl leading-relaxed">
              Your monthly salary is structured and released directly by management via Google Pay or Direct Bank Transfer at every month end.
            </p>
            <p className="text-xs text-teal-200 mt-2 font-semibold flex items-center gap-1.5">
              <User size={13} /> Supervising Staff Incharge: {primaryStaff.name} (📞 {primaryStaff.mobile})
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintAllPayslips}
          className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow transition shrink-0"
        >
          <Printer size={16} /> Print 3-Month Salary Statement
        </button>
      </div>

      {/* ── Overview Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Monthly Fixed Salary</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{currentSalary.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Fixed by Management</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Basic Pay</p>
          <p className="text-2xl font-black text-slate-800 mt-1">₹{basicPay.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400 mt-1">Per Month Base Rate</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-emerald-700 font-medium">Shift Allowance</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">+₹{allowance.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Bunk Station Duty</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-blue-700 font-medium">Payment Mode</p>
          <p className="text-xl font-black text-blue-800 mt-1 flex items-center gap-1.5">
            <Smartphone size={18} /> GPay / Bank
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Direct to Account</p>
        </div>
      </div>

      {/* ── 3-Month Payslips Table ── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <span>Verified 3-Month Payslip History</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click individual print button on any month to generate an official printable payslip letterhead
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3 text-left">Salary Month</th>
                <th className="p-3 text-left">Duty Station</th>
                <th className="p-3 text-right">Basic Pay</th>
                <th className="p-3 text-right">Allowance</th>
                <th className="p-3 text-right">Deductions</th>
                <th className="p-3 text-right">Net Payable</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Payslip Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PAYSLIP_HISTORY.map((slip, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800 text-xs sm:text-sm">{slip.month}</td>
                  <td className="p-3 text-slate-600">
                    <p className="font-semibold text-slate-800">{user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'}</p>
                    <p className="text-[10px] text-slate-400">{user?.bunkLocation || 'Chennai, Tamil Nadu'}</p>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-700">₹{slip.basic.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-emerald-600 font-semibold">+₹{slip.allowance.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-red-500 font-semibold">
                    {slip.deduction > 0 ? `-₹${slip.deduction.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                    ₹{slip.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold text-[10px]">
                      <Smartphone size={11} /> {slip.paymentMethod === 'gpay' ? 'GPay Transfer' : 'Direct Bank'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      slip.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {slip.status === 'paid' ? '✓ Paid' : '⏳ Processing'}
                    </span>
                    {slip.paidOn && (
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{slip.paidOn}</p>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handlePrintPayslip(slip)}
                      className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-xl font-bold transition text-xs shadow-sm"
                      title="Print Official Payslip"
                    >
                      <Printer size={13} />
                      <span>Print Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Candidate Bank & Payment Assistance ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-emerald-600" />
            <span>Bank & UPI Disbursal Details</span>
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Account Holder</span>
              <span className="font-bold text-slate-800">{user?.name || 'Karthik Velu'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered UPI (GPay)</span>
              <span className="font-mono font-bold text-blue-700">{user?.mobile}@okaxis</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Bank Account</span>
              <span className="font-mono font-bold text-slate-800">State Bank of India (XXXX-8921)</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Disbursal Frequency</span>
              <span className="font-semibold text-slate-700">Monthly by 5th</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <Phone size={16} className="text-orange-600" />
            <span>Supervisor Assistance</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you have any questions regarding your duty allowance, overtime, or salary credit date, please reach out directly to your assigned supervising staff:
          </p>
          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 text-sm">{primaryStaff.name}</p>
              <p className="text-[11px] text-slate-500">Field Supervising Staff</p>
            </div>
            <button
              onClick={() => setCallingContact({
                name: primaryStaff.name,
                role: 'Field Supervising Staff',
                mobile: primaryStaff.mobile,
                photo: primaryStaff.photo,
                bunk: user?.assignedBunk || 'Indian Oil Petrol Bunk (IOCL)'
              })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
            >
              <Phone size={13} />
              <span>Call Supervisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Phone Call Modal ── */}
      <PhoneCallModal
        isOpen={!!callingContact}
        onClose={() => setCallingContact(null)}
        contact={callingContact}
      />
    </DashboardLayout>
  );
}
