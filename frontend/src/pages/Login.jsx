import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

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

  // Already logged in
  if (user) {
    navigate(ROLE_REDIRECT[user.role]);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.mobile || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(form.mobile, form.password);
    setLoading(false);
    if (result.success) {
      navigate(ROLE_REDIRECT[result.role]);
    } else {
      setError(result.message);
    }
  };

  // Quick-fill demo accounts
  const DEMOS = [
    { label: 'Admin',   mobile: '9000000001', password: 'admin123',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: 'Manager', mobile: '9000000002', password: 'manager123', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { label: 'Staff',   mobile: '9000000004', password: 'staff123',   color: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'Client',  mobile: '9100000001', password: 'client123',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 pt-10 pb-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">CMS</span>
            </div>
            <h1 className="text-2xl font-bold">Client Management</h1>
            <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50"
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
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>Login</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              <p className="text-xs text-center text-slate-400 mb-3 font-medium">— Demo Accounts —</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMOS.map(d => (
                  <button
                    key={d.label}
                    onClick={() => setForm({ mobile: d.mobile, password: d.password })}
                    className={`text-xs border rounded-lg px-3 py-2 font-medium transition hover:scale-105 ${d.color}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-slate-400 mt-2">Click to fill credentials</p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2024 Client Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
