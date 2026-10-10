import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { LogIn, LogOut, Clock, CheckCircle, Calendar } from 'lucide-react';

function getToday() { return new Date().toISOString().split('T')[0]; }
function getTime()  { return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true }); }
function getDateLabel() { return new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); }

// Dummy visit history
const DUMMY_HISTORY = [
  { date:'2026-10-07', checkIn:'10:05 AM', checkOut:'05:30 PM', purpose:'Work Review Meeting', status:'completed' },
  { date:'2026-10-06', checkIn:'11:00 AM', checkOut:'01:00 PM', purpose:'Document Submission',  status:'completed' },
  { date:'2026-10-03', checkIn:'09:30 AM', checkOut:'04:00 PM', purpose:'Tax Filing Discussion', status:'completed' },
  { date:'2026-10-01', checkIn:'02:00 PM', checkOut:'03:30 PM', purpose:'Audit Meeting',         status:'completed' },
  { date:'2026-09-28', checkIn:'10:30 AM', checkOut:'12:00 PM', purpose:'Progress Update',       status:'completed' },
  { date:'2026-09-25', checkIn:'03:00 PM', checkOut:'04:45 PM', purpose:'Document Review',       status:'completed' },
];

export default function ClientAttendance() {
  const { user } = useAuth();
  const [now, setNow] = useState(getTime());
  const [punchIn, setPunchIn]   = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [purpose, setPurpose]   = useState('');
  const [showPurpose, setShowPurpose] = useState(false);
  const [toast, setToast]       = useState('');
  const [history, setHistory]   = useState(DUMMY_HISTORY);

  useEffect(() => {
    const t = setInterval(() => setNow(getTime()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handlePunchIn = () => {
    if (!purpose.trim()) { showToast('⚠️ Please enter visit purpose'); return; }
    const time = getTime();
    setPunchIn(time);
    setShowPurpose(false);
    showToast(`✅ Checked in at ${time}`);
  };

  const handlePunchOut = () => {
    const time = getTime();
    setPunchOut(time);
    setHistory(prev => [{ date: getToday(), checkIn: punchIn, checkOut: time, purpose, status: 'completed' }, ...prev]);
    showToast(`✅ Checked out at ${time}`);
  };

  const isPunchedIn  = !!punchIn;
  const isPunchedOut = !!punchOut;

  return (
    <DashboardLayout title="Office Visit">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-orange-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Live Clock */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-3xl p-6 text-white mb-6 text-center">
        <p className="text-orange-200 text-sm mb-1">{getDateLabel()}</p>
        <p className="text-4xl font-bold tracking-wide font-mono mb-1">{now}</p>
        <p className="text-orange-200 text-sm">{user?.name} · {user?.clientId?.toUpperCase()}</p>
      </div>

      {/* Today's Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-orange-500"/> Today's Visit Status
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className={`rounded-2xl p-4 text-center border-2 ${isPunchedIn?'bg-green-50 border-green-200':'bg-slate-50 border-slate-100'}`}>
            <LogIn size={22} className={`mx-auto mb-2 ${isPunchedIn?'text-green-600':'text-slate-300'}`}/>
            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Check In</p>
            <p className={`text-xl font-bold ${isPunchedIn?'text-green-700':'text-slate-300'}`}>{punchIn || '—'}</p>
            {isPunchedIn && <p className="text-xs text-green-600 mt-1">✓ Recorded</p>}
          </div>
          <div className={`rounded-2xl p-4 text-center border-2 ${isPunchedOut?'bg-orange-50 border-orange-200':'bg-slate-50 border-slate-100'}`}>
            <LogOut size={22} className={`mx-auto mb-2 ${isPunchedOut?'text-orange-600':'text-slate-300'}`}/>
            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Check Out</p>
            <p className={`text-xl font-bold ${isPunchedOut?'text-orange-700':'text-slate-300'}`}>{punchOut || '—'}</p>
            {isPunchedOut && <p className="text-xs text-orange-600 mt-1">✓ Recorded</p>}
          </div>
        </div>

        {/* Purpose input (shown before punch in) */}
        {!isPunchedIn && showPurpose && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Visit Purpose</label>
            <input
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="e.g. Document submission, Meeting, Work review..."
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        )}

        {/* Action Buttons */}
        {!isPunchedOut && (
          <div className="flex gap-3">
            {!isPunchedIn ? (
              <button
                onClick={() => showPurpose ? handlePunchIn() : setShowPurpose(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-bold text-base transition active:scale-95"
              >
                <LogIn size={20}/>
                {showPurpose ? 'Confirm Check In' : 'Check In'}
              </button>
            ) : (
              <button
                onClick={handlePunchOut}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white py-4 rounded-2xl font-bold text-base transition active:scale-95"
              >
                <LogOut size={20}/> Check Out
              </button>
            )}
          </div>
        )}

        {isPunchedOut && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700">
            <CheckCircle size={22} className="shrink-0"/>
            <div>
              <p className="font-bold">Visit Completed!</p>
              <p className="text-xs text-green-600">In: {punchIn} → Out: {punchOut} · Purpose: {purpose}</p>
            </div>
          </div>
        )}
      </div>

      {/* Visit History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock size={15} className="text-orange-500"/> Visit History
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {history.map((h, i) => (
            <div key={i} className="px-5 py-4 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-slate-700 text-sm">{h.purpose}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0">✓ Done</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>📅 {h.date}</span>
                <span>⏰ {h.checkIn} → {h.checkOut}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
