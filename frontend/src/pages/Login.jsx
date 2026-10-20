import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Users, X, Check, Shield, Briefcase, UserCheck } from 'lucide-react';
import { DUMMY_USERS } from '../data/dummyData.jsx';

const ROLE_REDIRECT = {
  admin: '/admin',
  manager: '/manager',
  staff: '/staff',
  client: '/client',
};

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [modalTab, setModalTab] = useState('client');

  // Safely redirect if user is already logged in
  useEffect(() => {
    if (user && user.role && ROLE_REDIRECT[user.role]) {
      navigate(ROLE_REDIRECT[user.role], { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!form.mobile || !form.password) {
      setError('Please enter your mobile number and password');
      return;
    }
    setLoading(true);
    try {
      const result = await login(form.mobile, form.password);
      if (result && result.success) {
        navigate(ROLE_REDIRECT[result.role] || '/admin', { replace: true });
      } else {
        setError(result?.message || 'Invalid mobile number or password');
      }
    } catch (err) {
      setError('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (u) => {
    setForm({ mobile: u.mobile, password: u.password });
    setShowAccountsModal(false);
  };

  // Quick-fill sample accounts
  const DEMOS = [
    { label: 'Admin',   sub: 'Arjun',   mobile: '9000000001', password: 'admin123',   color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
    { label: 'Manager', sub: 'Priya',   mobile: '9000000002', password: 'manager123', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
    { label: 'Staff',   sub: 'Anitha',  mobile: '9000000004', password: 'staff123',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
    { label: 'Client',  sub: 'Karthik', mobile: '9100000001', password: 'client123',  color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
  ];

  const modalUsers = DUMMY_USERS.filter(u => u.role === modalTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/90 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ELAKIYAA Subtle Watermark & Ambient Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center select-none">
        <span className="text-slate-900/[0.03] text-[90px] sm:text-[170px] font-black tracking-widest uppercase rotate-[-12deg]">
          ELAKIYAA
        </span>
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-violet-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-blue-200/50 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10 my-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
          {/* Top banner with Large ELAKIYAA Logo */}
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 sm:px-8 pt-7 pb-6 text-white text-center shadow-inner">
            <div className="bg-white p-3.5 rounded-2xl mx-auto mb-3.5 inline-block shadow-lg max-w-[280px]">
              <img src="/logo.png" alt="ELAKIYAA" className="h-16 sm:h-20 w-auto object-contain mx-auto" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Client Management System</h1>
            <p className="text-indigo-100 text-xs mt-1 font-medium">Official Workforce & Staff Portal</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Registered Mobile Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Account Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 flex items-center gap-2 font-medium">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>Sign In to Portal</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Quick-Fill Sample Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Test Credentials</p>
                <button
                  type="button"
                  onClick={() => setShowAccountsModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                >
                  <Users size={13} />
                  <span>View All 23 Accounts →</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEMOS.map(d => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setForm({ mobile: d.mobile, password: d.password })}
                    className={`text-xs border rounded-xl p-2 font-semibold transition flex flex-col items-start ${d.color}`}
                  >
                    <span className="font-bold">{d.label}</span>
                    <span className="text-[10px] opacity-75">{d.sub} · {d.mobile}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-4">
          © Client Management System · ELAKIYAA
        </p>
      </div>

      {/* ── All Accounts Modal (Educational / Testing) ── */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <Users size={18} />
                  <span>Registered Platform User Accounts</span>
                </h2>
                <p className="text-xs text-violet-100 mt-0.5">Click any account to automatically fill login credentials</p>
              </div>
              <button
                onClick={() => setShowAccountsModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Role Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 p-2 gap-1.5 text-xs font-bold">
              {[
                { id: 'client',  label: 'Clients / Workers (10)' },
                { id: 'staff',   label: 'Staff (10)' },
                { id: 'manager', label: 'Managers (2)' },
                { id: 'admin',   label: 'Admin (1)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id)}
                  className={`flex-1 py-2 px-2 rounded-xl transition text-center ${modalTab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-50">
              {modalUsers.map(u => (
                <div key={u.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={u.photo} alt={u.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 font-mono">📱 {u.mobile} · Pass: <span className="font-semibold text-slate-700">{u.password}</span></p>
                      {u.roleAtBunk && <p className="text-[10px] text-amber-700 font-medium truncate">{u.roleAtBunk}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className="shrink-0 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-indigo-200 transition"
                  >
                    Select & Fill
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                type="button"
                onClick={() => setShowAccountsModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
