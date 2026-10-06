import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Settings, Building, User, Bell, Lock, Palette, Globe, Save, Shield, Clock } from 'lucide-react';

const TABS = [
  { id: 'company',       label: 'Company',       icon: <Building size={16} /> },
  { id: 'account',       label: 'My Account',    icon: <User     size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell     size={16} /> },
  { id: 'security',      label: 'Security',      icon: <Lock     size={16} /> },
  { id: 'system',        label: 'System',        icon: <Settings size={16} /> },
];

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('company');
  const [toast,     setToast]     = useState('');

  // Company settings
  const [company, setCompany] = useState({
    name: 'My Company Pvt. Ltd.',
    address: '123, Main Street, Chennai, Tamil Nadu - 600001',
    phone: '9000000000',
    email: 'info@mycompany.com',
    website: 'www.mycompany.com',
    gst: 'GSTIN1234567890',
    logo: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    leaveRequests:   true,
    attendanceAlert: true,
    salaryReminder:  true,
    overdueAlert:    true,
    newClient:       false,
    dailyReport:     false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    autoLogout:         '30',
    passwordExpiry:     '90',
    twoFactor:          false,
    loginNotification:  true,
  });

  // System settings
  const [system, setSystem] = useState({
    dateFormat:     'DD/MM/YYYY',
    timeFormat:     '12h',
    currency:       'INR (₹)',
    language:       'English',
    attendanceStart: '09:00',
    attendanceLate:  '09:30',
    workingDays:     'Mon-Sat',
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
    </div>
  );

  const Toggle = ({ label, desc, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="font-medium text-slate-700 text-sm">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all relative ${value ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <DashboardLayout title="System Settings">

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm">{toast}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition
                  ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

          {/* ── Company ── */}
          {activeTab === 'company' && (
            <div className="space-y-5">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2"><Building size={18} className="text-blue-600" /> Company Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Company Name" value={company.name} onChange={v => setCompany(c => ({ ...c, name: v }))} placeholder="Company name" />
                <InputField label="Phone" value={company.phone} onChange={v => setCompany(c => ({ ...c, phone: v }))} placeholder="Phone number" />
                <InputField label="Email" value={company.email} onChange={v => setCompany(c => ({ ...c, email: v }))} placeholder="Company email" type="email" />
                <InputField label="Website" value={company.website} onChange={v => setCompany(c => ({ ...c, website: v }))} placeholder="Website URL" />
                <InputField label="GST Number" value={company.gst} onChange={v => setCompany(c => ({ ...c, gst: v }))} placeholder="GSTIN" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Address</label>
                <textarea value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
              </div>
              <button onClick={() => showToast('✅ Company settings saved!')}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}

          {/* ── My Account ── */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2"><User size={18} className="text-blue-600" /> My Account</h2>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">A</div>
                <div>
                  <p className="font-bold text-slate-800">Admin User</p>
                  <p className="text-sm text-slate-500">9000000001</p>
                  <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" value="Admin User" onChange={() => {}} placeholder="Your name" />
                <InputField label="Mobile" value="9000000001" onChange={() => {}} placeholder="Mobile number" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Change Password</label>
                <div className="space-y-3">
                  <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                  <input type="password" placeholder="New password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                  <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
              </div>
              <button onClick={() => showToast('✅ Account updated!')}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                <Save size={15} /> Update Account
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2"><Bell size={18} className="text-blue-600" /> Notification Settings</h2>
              <div className="bg-slate-50 rounded-2xl px-5 py-2">
                <Toggle label="Leave Requests"      desc="Alert when staff applies for leave"       value={notifications.leaveRequests}   onChange={v => setNotifications(n => ({ ...n, leaveRequests:   v }))} />
                <Toggle label="Attendance Alerts"   desc="Alert when staff is late or absent"       value={notifications.attendanceAlert} onChange={v => setNotifications(n => ({ ...n, attendanceAlert: v }))} />
                <Toggle label="Salary Reminders"    desc="Monthly salary payment reminders"         value={notifications.salaryReminder}  onChange={v => setNotifications(n => ({ ...n, salaryReminder:  v }))} />
                <Toggle label="Overdue Alerts"      desc="Alert when tasks are overdue"             value={notifications.overdueAlert}    onChange={v => setNotifications(n => ({ ...n, overdueAlert:    v }))} />
                <Toggle label="New Client Added"    desc="Notify when a new client is registered"  value={notifications.newClient}       onChange={v => setNotifications(n => ({ ...n, newClient:       v }))} />
                <Toggle label="Daily Report"        desc="Receive daily summary report"             value={notifications.dailyReport}     onChange={v => setNotifications(n => ({ ...n, dailyReport:     v }))} />
              </div>
              <button onClick={() => showToast('✅ Notification settings saved!')}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                <Save size={15} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2"><Shield size={18} className="text-blue-600" /> Security Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Auto Logout (minutes)</label>
                  <select value={security.autoLogout} onChange={e => setSecurity(s => ({ ...s, autoLogout: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Password Expiry (days)</label>
                  <select value={security.passwordExpiry} onChange={e => setSecurity(s => ({ ...s, passwordExpiry: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="0">Never expire</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl px-5 py-2">
                <Toggle label="Two-Factor Authentication" desc="Extra security layer for login" value={security.twoFactor}         onChange={v => setSecurity(s => ({ ...s, twoFactor:         v }))} />
                <Toggle label="Login Notifications"       desc="Alert on new login to account" value={security.loginNotification} onChange={v => setSecurity(s => ({ ...s, loginNotification: v }))} />
              </div>
              <button onClick={() => showToast('✅ Security settings saved!')}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                <Save size={15} /> Save Security
              </button>
            </div>
          )}

          {/* ── System ── */}
          {activeTab === 'system' && (
            <div className="space-y-5">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2"><Settings size={18} className="text-blue-600" /> System Preferences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Date Format</label>
                  <select value={system.dateFormat} onChange={e => setSystem(s => ({ ...s, dateFormat: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Time Format</label>
                  <select value={system.timeFormat} onChange={e => setSystem(s => ({ ...s, timeFormat: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option value="12h">12 Hour (AM/PM)</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Attendance Start Time</label>
                  <input type="time" value={system.attendanceStart} onChange={e => setSystem(s => ({ ...s, attendanceStart: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Late Mark After</label>
                  <input type="time" value={system.attendanceLate} onChange={e => setSystem(s => ({ ...s, attendanceLate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Working Days</label>
                  <select value={system.workingDays} onChange={e => setSystem(s => ({ ...s, workingDays: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option>Mon-Fri</option>
                    <option>Mon-Sat</option>
                    <option>Mon-Sun</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Currency</label>
                  <select value={system.currency} onChange={e => setSystem(s => ({ ...s, currency: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
              <button onClick={() => showToast('✅ System settings saved!')}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                <Save size={15} /> Save System Settings
              </button>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
