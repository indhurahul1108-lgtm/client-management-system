import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, Shield, Lock } from 'lucide-react';

const STEPS = ['mobile', 'otp', 'newpass', 'done'];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (mobile.length !== 10) { setError('Enter valid 10-digit mobile number'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('otp');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (otp !== '123456') { setError('Invalid OTP. Use dummy OTP: 123456'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    setStep('newpass');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPass !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setStep('done');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 pt-8 pb-6 text-white">
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition">
            <ArrowLeft size={16} /> Back to Login
          </button>
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-blue-200 text-sm mt-1">
            {step === 'mobile' && 'Enter your registered mobile number'}
            {step === 'otp'    && 'Enter the OTP sent to your mobile'}
            {step === 'newpass'&& 'Create a new password'}
            {step === 'done'   && 'Password reset successful!'}
          </p>
        </div>

        <div className="p-8">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {['Mobile', 'OTP', 'New Pass', 'Done'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
                  ${STEPS.indexOf(step) >= i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-xs">{i + 1}</span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 rounded ${STEPS.indexOf(step) > i ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step: Mobile */}
          {step === 'mobile' && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" maxLength={10} placeholder="Enter mobile number"
                    value={mobile} onChange={e => setMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 text-center">
                OTP sent to <strong>+91 {mobile}</strong>
                <br /><span className="text-blue-500 text-xs">(Demo OTP: <strong>123456</strong>)</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter OTP</label>
                <input type="text" maxLength={6} placeholder="6-digit OTP"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* Step: New Password */}
          {step === 'newpass' && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="Min 6 characters"
                    value={newPass} onChange={e => setNewPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="Re-enter password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Password Reset!</h3>
                <p className="text-slate-500 text-sm mt-1">Your password has been updated successfully.</p>
              </div>
              <button onClick={() => navigate('/login')}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
