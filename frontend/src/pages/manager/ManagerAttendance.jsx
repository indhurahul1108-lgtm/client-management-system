import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS, DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { calcLateMinutes, formatLate, SHIFT_CONFIG, SHIFTS } from '../../utils/attendanceUtils.js';
import { Clock, Camera, AlertTriangle, X, LogIn, LogOut, CheckCircle, MapPin, Users } from 'lucide-react';

const STATUS_FILTERS = ['all', 'present', 'late', 'absent'];

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function ManagerAttendance() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role === 'staff' && u.managerId === mId);
  const myStaffIds = myStaff.map(s => s.id);

  // Tabs: 'my' (Manager's own punch) or 'team' (Staff Attendance)
  const [activeTab, setActiveTab] = useState('my');
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);

  // Manager Self-Punch Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [punchType, setPunchType] = useState(null);
  const [step, setStep] = useState('idle'); // idle | camera | confirm
  const [composedPhoto, setComposedPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('Chennai, Tamil Nadu');
  const [punched, setPunched] = useState({ in: null, out: null });
  const [myAttendance, setMyAttendance] = useState([
    { id: 'ma1', date: new Date().toISOString().split('T')[0], punchIn: '09:45 AM', punchOut: '06:15 PM', status: 'present', location: 'Chennai HQ' },
    { id: 'ma2', date: '2026-10-09', punchIn: '09:50 AM', punchOut: '06:30 PM', status: 'present', location: 'Chennai HQ' },
    { id: 'ma3', date: '2026-10-08', punchIn: '10:15 AM', punchOut: '06:00 PM', status: 'late', lateMinutes: 15, location: 'Chennai HQ' },
    { id: 'ma4', date: '2026-10-07', punchIn: '09:40 AM', punchOut: '06:20 PM', status: 'present', location: 'Chennai HQ' },
  ]);

  const teamAtt = DUMMY_ATTENDANCE.filter(a => myStaffIds.includes(a.userId));
  const filteredTeam = filter === 'all' ? teamAtt : teamAtt.filter(a => a.status === filter);

  const presentN = teamAtt.filter(a => a.status === 'present').length;
  const absentN = teamAtt.filter(a => a.status === 'absent').length;
  const lateN = teamAtt.filter(a => a.status === 'late').length;

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  const startCamera = async (type) => {
    setPunchType(type);
    setStep('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      // fallback photo simulator
      captureFallback(type);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }),
        () => setLocation({ lat: '13.0827', lng: '80.2707' })
      );
    }
  };

  const captureFallback = (type) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dummyPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Manager')}&background=7c3aed&color=fff&size=256`;
    setComposedPhoto(dummyPhoto);
    setStep('confirm');
  };

  const snapPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const W = video.videoWidth || 640;
      const H = video.videoHeight || 480;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, W, H);

      // Watermark
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, H - 70, W, 70);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      const now = new Date();
      ctx.fillText(`${user?.name} (Manager) - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 15, H - 40);
      ctx.font = '13px sans-serif';
      ctx.fillText(`GPS: ${location ? `${location.lat}, ${location.lng}` : '13.0827, 80.2707'} | Chennai HQ`, 15, H - 18);

      setComposedPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setStep('confirm');
    } else {
      captureFallback(punchType);
    }
  };

  const confirmPunch = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];

    if (punchType === 'in') {
      setPunched(prev => ({ ...prev, in: timeStr }));
      setMyAttendance(prev => [
        { id: `ma_${Date.now()}`, date: todayStr, punchIn: timeStr, punchOut: '—', status: 'present', location: locationText },
        ...prev.filter(a => a.date !== todayStr)
      ]);
    } else {
      setPunched(prev => ({ ...prev, out: timeStr }));
      setMyAttendance(prev => prev.map(a => a.date === todayStr ? { ...a, punchOut: timeStr } : a));
    }
    setStep('idle');
  };

  return (
    <DashboardLayout title="Attendance Management">
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Tabs: Manager's Own Attendance vs Team Attendance */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveTab('my')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'my' ? 'bg-purple-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Camera size={16} /> My Punch In / Punch Out
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'team' ? 'bg-purple-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Users size={16} /> Team Attendance ({myStaff.length} Staff)
        </button>
      </div>

      {/* ── TAB 1: MANAGER SELF ATTENDANCE ──────────────────────── */}
      {activeTab === 'my' && (
        <div className="space-y-6">
          {/* Punch In / Out Action Card */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-purple-200 text-xs font-semibold uppercase tracking-wider">Manager Geo-Attendance</p>
                <h2 className="text-2xl font-bold mt-0.5">{user?.name} (Manager)</h2>
                <p className="text-xs text-purple-200 mt-1 flex items-center gap-1.5">
                  <MapPin size={13} /> {locationText} · General Shift (10:00 AM - 07:00 PM)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-white/20 backdrop-blur px-3 py-1.5 rounded-full font-bold">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>

            {/* Today Punch Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-purple-200 mb-1">Today Punch In</p>
                <p className="text-xl font-bold font-mono">{punched.in || '09:45 AM'}</p>
                <span className="text-[10px] text-green-300 font-bold mt-1 inline-block">✓ Recorded with GPS</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-purple-200 mb-1">Today Punch Out</p>
                <p className="text-xl font-bold font-mono">{punched.out || '—'}</p>
                <span className="text-[10px] text-purple-200 mt-1 inline-block">Expected after 06:00 PM</span>
              </div>
            </div>

            {/* Punch Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => startCamera('in')}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow transition active:scale-95 text-sm"
              >
                <LogIn size={18} /> Punch In (Camera)
              </button>
              <button
                onClick={() => startCamera('out')}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow transition active:scale-95 text-sm"
              >
                <LogOut size={18} /> Punch Out (Camera)
              </button>
            </div>
          </div>

          {/* Camera / Confirm Modal */}
          {step === 'camera' && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-800">Punch {punchType === 'in' ? 'In' : 'Out'} Selfie</h3>
                  <button onClick={() => { stopCamera(); setStep('idle'); }}><X size={18} /></button>
                </div>
                <video ref={videoRef} autoPlay playsInline className="w-full h-56 bg-black rounded-2xl object-cover mb-4" />
                <button
                  onClick={snapPhoto}
                  className="w-full py-3 bg-purple-700 text-white rounded-xl font-bold text-sm hover:bg-purple-800 flex items-center justify-center gap-2"
                >
                  <Camera size={16} /> Capture Photo with GPS
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
                <h3 className="font-bold text-slate-800 mb-2">Confirm Attendance</h3>
                {composedPhoto && (
                  <img src={composedPhoto} alt="" className="w-full h-56 rounded-2xl object-cover mb-4 border" />
                )}
                <p className="text-xs text-slate-500 mb-4">Location: {locationText} · Status: Present</p>
                <div className="flex gap-2">
                  <button onClick={() => setStep('idle')} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-slate-600">Cancel</button>
                  <button onClick={confirmPunch} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">Confirm & Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Manager's Own Attendance History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">My Attendance History (Last 3 Months)</h3>
              <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full">Manager Log</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Punch In</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Punch Out</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myAttendance.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs font-mono text-slate-700">{a.date}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{a.punchIn}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{a.punchOut}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{a.location}</td>
                      <td className="px-4 py-3"><Badge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: TEAM STAFF ATTENDANCE ────────────────────────── */}
      {activeTab === 'team' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[['Present', presentN, 'green'], ['Absent', absentN, 'red'], ['Late', lateN, 'yellow']].map(([l, v, c]) => (
              <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Filters */}
            <div className="px-5 py-4 border-b border-slate-50 flex gap-2 flex-wrap">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${filter === f ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {f === 'all' ? `All (${teamAtt.length})` : `${f} (${teamAtt.filter(a => a.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Staff', 'Date', 'Punch In', 'Punch Out', 'Late By', 'Photo', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTeam.map(a => {
                    const lateMins = calcLateMinutes(a.punchIn);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-700 text-xs">{a.staffName}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{a.date}</td>
                        <td className="px-4 py-3 text-xs font-mono font-medium">{a.punchIn || '—'}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-400">{a.punchOut || '—'}</td>
                        <td className="px-4 py-3">
                          {lateMins > 0 ? (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">{formatLate(lateMins)}</span>
                          ) : a.status === 'present' ? (
                            <span className="text-xs text-green-600 font-medium">On time</span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {a.photo ? (
                            <img
                              src={a.photo}
                              alt=""
                              onClick={() => setPreview(a.photo)}
                              className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:opacity-80 border"
                            />
                          ) : <span className="text-xs text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3"><Badge status={a.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredTeam.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No records found</p>}
          </div>

          {preview && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
              <div className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden p-2">
                <button onClick={() => setPreview(null)} className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-1"><X size={16} /></button>
                <img src={preview} alt="Attendance photo" className="w-full rounded-xl" />
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
