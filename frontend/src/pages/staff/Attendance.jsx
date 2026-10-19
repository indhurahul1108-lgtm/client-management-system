import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_ATTENDANCE, DUMMY_USERS } from '../../data/dummyData.jsx';
import { calcLateMinutes, formatLate, SHIFT_CONFIG } from '../../utils/attendanceUtils.js';
import { printIndividualRecord } from '../../utils/printUtils.js';
import { Camera, MapPin, Clock, CheckCircle, LogIn, LogOut, CalendarCheck, X, AlertTriangle, Users, Printer, ShieldCheck, Calendar } from 'lucide-react';

function Badge({ status }) {
  const map = {
    present: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-slate-100 text-slate-600'
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function StaffAttendance() {
  const { user } = useAuth();
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [activeTab, setActiveTab] = useState('client_attendance'); // default to client attendance
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [punchType,     setPunchType]     = useState(null);   // 'in' | 'out'
  const [step,          setStep]          = useState('idle'); // idle | camera | composing | confirm
  const [composedPhoto, setComposedPhoto] = useState(null);  // final photo with overlay
  const [location,      setLocation]      = useState(null);
  const [locationText,  setLocationText]  = useState('');
  const [loadingLoc,    setLoadingLoc]    = useState(false);
  const [punched,       setPunched]       = useState({ in: null, out: null });
  const [toast,         setToast]         = useState('');

  const [clientList, setClientList] = useState(() => {
    const clients = DUMMY_USERS.filter(u => u.role === 'client');
    return clients.map((c, i) => ({
      ...c,
      todayStatus: c.dutyStatus === 'approved' ? 'present' : (c.dutyStatus === 'late' ? 'late' : (i % 3 === 0 ? 'absent' : 'present')),
      dutyApprovalStatus: c.dutyStatus || (i % 3 === 0 ? 'absent' : 'approved'),
      approvedBy: c.approvedBy || (i % 3 === 0 ? null : `${user?.name || 'Anitha Devi'} (Staff)`),
      markedAt: c.approvedAt || (i % 3 === 0 ? '—' : '06:05 AM'),
    }));
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const updateClientStatus = (clientId, status) => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const staffName = `${user?.name || 'Staff Supervisor'} (Staff)`;

    setClientList(prev => prev.map(c => {
      if (c.id === clientId || c.clientId === clientId) {
        return {
          ...c,
          todayStatus: status,
          dutyApprovalStatus: status === 'present' ? 'approved' : status,
          approvedBy: status === 'absent' ? null : staffName,
          markedAt: status === 'absent' ? '—' : now
        };
      }
      return c;
    }));

    const clientObj = clientList.find(c => c.id === clientId || c.clientId === clientId);
    if (status === 'present') {
      showToast(`✅ Duty Approved for ${clientObj?.name || 'Candidate'}! Marked Present.`);
    } else if (status === 'late') {
      showToast(`⚠️ ${clientObj?.name || 'Candidate'} marked as Late on Duty.`);
    } else {
      showToast(`🔴 ${clientObj?.name || 'Candidate'} marked as Absent.`);
    }
  };

  const printClientRecord = (c) => {
    printIndividualRecord({
      title: 'Candidate / Worker Attendance Record (3-Month Statement)',
      person: {
        name: c.name,
        staffId: c.clientId,
        mobile: c.mobile,
        role: 'Client Candidate',
        roleAtBunk: c.roleAtBunk || 'Worker',
        assignedBunk: c.assignedBunk || 'Petrol Bunk',
        shift: c.shift || 'Shift 1: Morning',
      },
      type: 'attendance',
      records: [
        { date: '2026-10-10', punchIn: c.markedAt || '06:00 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: c.todayStatus || 'present' },
        { date: '2026-10-09', punchIn: '05:58 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'present' },
        { date: '2026-10-08', punchIn: '06:12 AM', punchOut: '02:05 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'late', lateMinutes: 12 },
        { date: '2026-10-07', punchIn: '06:00 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'present' },
        { date: '2026-09-30', punchIn: '05:55 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'present' },
        { date: '2026-09-29', punchIn: '06:00 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'present' },
        { date: '2026-08-31', punchIn: '05:58 AM', punchOut: '02:00 PM', location: c.assignedBunk || 'Petrol Bunk', status: 'present' },
      ]
    });
  };

  const myHistory = DUMMY_ATTENDANCE.filter(a => a.userId === user?.id);

  /* ── helpers ─────────────────────────────────── */

  const stopCamera = () => {
    if (videoRef.current?.srcObject)
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  };

  /** Draw date/time/location watermark ON the photo and return dataURL */
  const composePhoto = (videoEl, lat, lng, locText) => {
    const canvas = canvasRef.current;
    const W = videoEl.videoWidth  || 640;
    const H = videoEl.videoHeight || 480;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Mirror (selfie) + draw frame
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoEl, -W, 0, W, H);
    ctx.restore();

    // --- Watermark bar ---
    const barH = 100;
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(0, H - barH, W, barH);

    const now     = new Date();
    const dateStr = now.toLocaleDateString('en-IN',  { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN',  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const gps     = lat ? `${lat}, ${lng}` : 'Location unavailable';
    const place   = locText || gps;

    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 15px Arial, sans-serif';
    ctx.fillText(`📅  ${dateStr}`, 12, H - barH + 24);
    ctx.fillText(`🕐  ${timeStr}`, 12, H - barH + 48);

    ctx.font = '13px Arial, sans-serif';
    ctx.fillStyle = '#94d8fc';
    const maxW   = W - 20;
    let   locLine = `📍  ${place}`;
    while (ctx.measureText(locLine).width > maxW && locLine.length > 20)
      locLine = locLine.slice(0, -4) + '…';
    ctx.fillText(locLine, 12, H - barH + 72);

    // Staff name top-right
    ctx.font      = 'bold 13px Arial, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'right';
    ctx.fillText(user?.name || '', W - 12, H - barH + 24);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/jpeg', 0.92);
  };

  /* ── actions ─────────────────────────────────── */

  const openCamera = async (type) => {
    setPunchType(type);
    setComposedPhoto(null);
    setLocation(null);
    setLocationText('');
    setStep('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.transform = 'scaleX(-1)';
      }
    } catch {
      alert('Camera access denied. Please allow camera permission.');
      setStep('idle');
    }
  };

  const captureAndCompose = () => {
    setStep('composing');
    setLoadingLoc(true);
    const video = videoRef.current;
    stopCamera();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setLocation({ lat, lng });

        let place = `${lat}, ${lng}`;
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          place = data.display_name?.split(',').slice(0, 3).join(', ') || place;
        } catch { /* use coords */ }

        setLocationText(place);
        setComposedPhoto(composePhoto(video, lat, lng, place));
        setLoadingLoc(false);
        setStep('confirm');
      },
      () => {
        const lat = '13.0827', lng = '80.2707';
        setLocation({ lat, lng });
        setLocationText('Chennai, Tamil Nadu (default)');
        setComposedPhoto(composePhoto(video, lat, lng, 'Chennai, Tamil Nadu'));
        setLoadingLoc(false);
        setStep('confirm');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const confirmPunch = () => {
    const now     = new Date();
    const time    = now.toTimeString().slice(0, 5);
    const lateMin = punchType === 'in'
      ? calcLateMinutes(time, SHIFT_CONFIG.shiftStart, SHIFT_CONFIG.graceMins)
      : null;
    if (punchType === 'in') {
      setPunched(p => ({ ...p, in: { time, photo: composedPhoto, location, lateMinutes: lateMin } }));
    } else {
      setPunched(p => ({ ...p, out: { time, photo: composedPhoto, location } }));
    }
    setComposedPhoto(null);
    setLocation(null);
    setPunchType(null);
    setStep('idle');
  };

  const cancel = () => {
    stopCamera();
    setStep('idle');
    setComposedPhoto(null);
  };

  /* ── render ──────────────────────────────────── */
  return (
    <DashboardLayout title="Attendance">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          {toast}
        </div>
      )}

      {/* ── Mode Switcher Tabs ── */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 max-w-lg">
        <button
          onClick={() => setActiveTab('client_attendance')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'client_attendance' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Users size={16} /> Client Duty Approval & Verification
        </button>
        <button
          onClick={() => setActiveTab('my_attendance')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'my_attendance' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Clock size={16} /> My Attendance (Selfie Punch)
        </button>
      </div>

      {activeTab === 'client_attendance' ? (
        /* ── CLIENT ATTENDANCE MARKING TAB ── */
        <div className="space-y-6">
          {/* Information Notice Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">Candidate Duty Verification & Approval</h3>
                <p className="text-xs text-orange-100 mt-0.5 leading-relaxed">
                  Clients / candidates do not punch manually. As field staff, you verify their physical presence at the assigned petrol bunk and approve duty attendance.
                </p>
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl shrink-0 border border-white/20">
              <Calendar size={15} />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Stats for Clients */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
              <p className="text-2xl font-bold text-slate-800">{clientList.length}</p>
              <p className="text-xs text-slate-500 font-medium">Total Assigned Candidates</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-2xl font-bold text-emerald-700">{clientList.filter(c => c.todayStatus === 'present').length}</p>
              <p className="text-xs text-emerald-600 font-medium">Approved on Duty</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-2xl font-bold text-amber-700">{clientList.filter(c => c.todayStatus === 'late').length}</p>
              <p className="text-xs text-amber-600 font-medium">Marked Late</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <p className="text-2xl font-bold text-rose-700">{clientList.filter(c => c.todayStatus === 'absent').length}</p>
              <p className="text-xs text-rose-600 font-medium">Marked Absent</p>
            </div>
          </div>

          {/* Clients List with Attendance Actions */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Assigned Petrol Bunk Deployments ({selectedDate})</h3>
                <p className="text-xs text-slate-400">Click Approve Duty (Present) / Late / Absent to verify candidate presence</p>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Staff Incharge Mode
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {clientList.map(c => (
                <div key={c.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                  <div className="flex items-start sm:items-center gap-3">
                    <img src={c.photo} alt={c.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{c.clientId?.toUpperCase()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          c.todayStatus === 'present' ? 'bg-emerald-100 text-emerald-700' :
                          c.todayStatus === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {c.todayStatus === 'present' ? '✓ Approved On Duty' : c.todayStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                        <MapPin size={12} className="text-orange-600 shrink-0" />
                        <span>{c.assignedBunk || 'Petrol Bunk Station'}</span>
                        <span className="text-slate-400 font-normal">({c.roleAtBunk || 'Attendant'})</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        Shift: {c.shift || 'Shift 1: Morning'} &nbsp;|&nbsp;
                        {c.approvedBy ? (
                          <span className="text-emerald-700 font-semibold">
                            Verified by {c.approvedBy} at {c.markedAt}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">Pending Verification</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Mark Buttons */}
                    <button
                      onClick={() => updateClientStatus(c.id, 'present')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${c.todayStatus === 'present' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      title="Approve candidate duty presence at station"
                    >
                      <CheckCircle size={14} /> Approve Duty (Present)
                    </button>
                    <button
                      onClick={() => updateClientStatus(c.id, 'late')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${c.todayStatus === 'late' ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                    >
                      <Clock size={14} /> Mark Late
                    </button>
                    <button
                      onClick={() => updateClientStatus(c.id, 'absent')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${c.todayStatus === 'absent' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                    >
                      <X size={14} /> Mark Absent
                    </button>

                    {/* Single Person Print Button */}
                    <button
                      onClick={() => printClientRecord(c)}
                      className="ml-auto lg:ml-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      title="Print 3-Month Statement for this candidate"
                    >
                      <Printer size={13} /> Print Statement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── STAFF'S OWN ATTENDANCE TAB ── */
        <div>
          {/* ── Punch Card ── */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">My Personal Attendance</h2>
                <p className="text-blue-200 text-xs mt-0.5">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs font-medium mb-1">Punch In</p>
                <p className="text-2xl font-bold">{punched.in?.time || '—'}</p>
                {punched.in && punched.in.lateMinutes > 0
                  ? <p className="text-red-300 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {formatLate(punched.in.lateMinutes)}</p>
                  : punched.in && <p className="text-green-300 text-xs mt-1">✓ On Time</p>}
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs font-medium mb-1">Punch Out</p>
                <p className="text-2xl font-bold">{punched.out?.time || '—'}</p>
                {punched.out && <p className="text-green-300 text-xs mt-1">✓ Recorded</p>}
              </div>
            </div>

            {/* Shift info */}
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-blue-200 mb-4">
              <span>⏰ Shift: <strong className="text-white">{SHIFT_CONFIG.shiftStart}</strong></span>
              <span>⚡ Grace: <strong className="text-white">{SHIFT_CONFIG.graceMins} mins</strong></span>
              <span>🔴 Late after: <strong className="text-white">{(() => { const [h,m]=SHIFT_CONFIG.shiftStart.split(':').map(Number); const t=h*60+m+SHIFT_CONFIG.graceMins; return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; })()} </strong></span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => openCamera('in')} disabled={!!punched.in}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition shadow-lg">
                <div className="flex items-center gap-2 text-base">
                  <LogIn size={20} />
                  <span>Punch In</span>
                </div>
                <span className="text-[11px] font-normal text-green-100">Selfie & GPS Verification</span>
              </button>
              <button onClick={() => openCamera('out')} disabled={!punched.in || !!punched.out}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition shadow-lg">
                <div className="flex items-center gap-2 text-base">
                  <LogOut size={20} />
                  <span>Punch Out</span>
                </div>
                <span className="text-[11px] font-normal text-red-100">Shift End Verification</span>
              </button>
            </div>
          </div>

          {/* ── Attendance History ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">My Attendance History</h2>
              <button
                onClick={() => printIndividualRecord({
                  title: 'Staff Personal Attendance Statement',
                  person: user,
                  type: 'attendance',
                  records: myHistory
                })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold"
              >
                <Printer size={13} /> Print My Statement
              </button>
            </div>
            {myHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch In</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Punch Out</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myHistory.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 font-medium text-slate-700">{a.date}</td>
                        <td className="px-4 py-3 text-slate-500">{a.punchIn || '—'}</td>
                        <td className="px-4 py-3 text-slate-500">{a.punchOut || '—'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{a.location || '—'}</td>
                        <td className="px-4 py-3"><Badge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <CalendarCheck size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No attendance records yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Hidden canvas for composing photo ── */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Camera Modal ── */}
      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm">
            <div className="relative bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <button onClick={cancel} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-center text-slate-500 text-xs">Look at camera clearly. Location + Date + Time will be added on photo.</p>
              <button onClick={captureAndCompose}
                className="w-full bg-blue-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition">
                <Camera size={18} /> Capture Photo
              </button>
              <button onClick={cancel} className="w-full text-slate-400 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Composing (loading) ── */}
      {step === 'composing' && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center w-72">
            <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-slate-800">Processing Photo...</p>
            <p className="text-slate-400 text-xs mt-1">Adding location & timestamp</p>
          </div>
        </div>
      )}

      {/* ── Confirm Modal ── */}
      {step === 'confirm' && composedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-900 p-1">
              <img src={composedPhoto} alt="captured" className="w-full rounded-2xl" />
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-800 text-center">
                Confirm {punchType === 'in' ? '🟢 Punch In' : '🔴 Punch Out'}
              </h3>
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
                <p>📅 {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p>🕐 {new Date().toLocaleTimeString('en-IN')}</p>
                <p className="text-blue-600">📍 {locationText}</p>
              </div>
              <button onClick={confirmPunch}
                className="w-full bg-blue-700 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Confirm
              </button>
              <button onClick={cancel} className="w-full text-slate-400 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
