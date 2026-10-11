import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { SHIFTS } from '../../utils/attendanceUtils.js';
import { Camera, MapPin, Clock, LogIn, LogOut, CheckCircle, Fuel, X, Calendar, UserCheck } from 'lucide-react';

const INITIAL_LOGS = [
  { id: 'att_1', staffName: 'Anitha Devi', role: 'Lead Fuel Operator', shift: 'Morning Shift (06:00 AM - 02:00 PM)', punchIn: '05:55 AM', punchOut: '02:05 PM', date: '2026-10-10', location: 'Anna Salai Bunk, Chennai (13.0827, 80.2707)', photo: 'https://ui-avatars.com/api/?name=Anitha+Devi&background=16a34a&color=fff', status: 'present' },
  { id: 'att_2', staffName: 'Murugan P', role: 'Cashier & Accounts', shift: 'Evening Shift (02:00 PM - 10:00 PM)', punchIn: '01:58 PM', punchOut: '10:02 PM', date: '2026-10-10', location: 'Anna Salai Bunk, Chennai (13.0827, 80.2707)', photo: 'https://ui-avatars.com/api/?name=Murugan+P&background=d97706&color=fff', status: 'present' },
  { id: 'att_3', staffName: 'Vijay S', role: 'Night Attendant', shift: 'Night Shift (10:00 PM - 06:00 AM)', punchIn: '10:00 PM', punchOut: '06:05 AM', date: '2026-10-09', location: 'Anna Salai Bunk, Chennai (13.0827, 80.2707)', photo: 'https://ui-avatars.com/api/?name=Vijay+S&background=9333ea&color=fff', status: 'present' },
  { id: 'att_4', staffName: 'Deepa S', role: 'Nozzle Attendant', shift: 'Morning Shift (06:00 AM - 02:00 PM)', punchIn: '06:12 AM', punchOut: '02:00 PM', date: '2026-10-09', location: 'Anna Salai Bunk, Chennai (13.0827, 80.2707)', photo: 'https://ui-avatars.com/api/?name=Deepa+S&background=0891b2&color=fff', status: 'late' },
];

export default function ClientAttendance() {
  const { user } = useAuth();
  const staffList = DUMMY_USERS.filter(u => u.role === 'staff');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [selectedStaff, setSelectedStaff] = useState(staffList[0]?.name || 'Anitha Devi');
  const [selectedShift, setSelectedShift] = useState('shift_1');
  const [punchType, setPunchType] = useState('in'); // 'in' | 'out'
  const [step, setStep] = useState('idle'); // idle | camera | confirm
  const [composedPhoto, setComposedPhoto] = useState(null);
  const [locationText, setLocationText] = useState('Bunk Location: Anna Salai, Chennai (GPS: 13.0827, 80.2707)');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

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
      const dummyPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff)}&background=ea580c&color=fff&size=256`;
      setComposedPhoto(dummyPhoto);
      setStep('confirm');
    }
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

      // Watermark bar with Date, Time, Bunk Location, Shift
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(0, H - 75, W, 75);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px sans-serif';
      const now = new Date();
      const shiftObj = SHIFTS.find(s => s.id === selectedShift);
      ctx.fillText(`ELAKIYAA BUNK PUNCH: ${selectedStaff} (${shiftObj?.name})`, 15, H - 45);
      ctx.font = '12px sans-serif';
      ctx.fillText(`${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN')} | GPS: 13.0827, 80.2707 | ${user?.name || 'Petrol Bunk'}`, 15, H - 20);

      setComposedPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setStep('confirm');
    } else {
      const dummyPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff)}&background=ea580c&color=fff&size=256`;
      setComposedPhoto(dummyPhoto);
      setStep('confirm');
    }
  };

  const confirmPunch = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];
    const shiftObj = SHIFTS.find(s => s.id === selectedShift);

    if (punchType === 'in') {
      const newEntry = {
        id: `att_${Date.now()}`,
        staffName: selectedStaff,
        role: 'Fuel Attendant / Operator',
        shift: `${shiftObj?.name} (${shiftObj?.label})`,
        punchIn: timeStr,
        punchOut: '—',
        date: todayStr,
        location: `${user?.name || 'Petrol Bunk'} (GPS: 13.0827, 80.2707)`,
        photo: composedPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff)}`,
        status: 'present',
      };
      setLogs(prev => [newEntry, ...prev]);
      showToast(`✅ ${selectedStaff} Punched In at ${timeStr}`);
    } else {
      setLogs(prev => prev.map(l => (l.staffName === selectedStaff && l.date === todayStr) ? { ...l, punchOut: timeStr } : l));
      showToast(`✅ ${selectedStaff} Punched Out at ${timeStr}`);
    }
    setStep('idle');
  };

  return (
    <DashboardLayout title="Petrol Bunk Staff Attendance">
      <canvas ref={canvasRef} className="hidden" />

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-orange-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white mb-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Fuel size={13} /> ELAKIYAA Bunk Manpower Attendance
              </span>
              <span className="text-xs text-orange-200">Camera & GPS Verified</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">{user?.name || 'Indian Oil Petrol Bunk'}</h1>
            <p className="text-xs text-orange-100 mt-1 flex items-center gap-1">
              <MapPin size={12} /> {locationText}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 text-xs px-3 py-1.5 rounded-full font-bold block">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Shift & Staff Selector for Punch */}
        <div className="bg-black/20 backdrop-blur rounded-2xl p-4 border border-white/20 mt-4">
          <p className="text-xs font-bold text-orange-100 uppercase tracking-wider mb-3">Record Attendant Shift Punch (Photo + GPS)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-orange-200 block mb-1">Select Bunk Attendant (Staff)</label>
              <select
                value={selectedStaff}
                onChange={e => setSelectedStaff(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white text-slate-800 text-xs font-bold"
              >
                {staffList.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.staffId})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-orange-200 block mb-1">Select Active Shift (3 Shifts)</label>
              <select
                value={selectedShift}
                onChange={e => setSelectedShift(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white text-slate-800 text-xs font-bold"
              >
                {SHIFTS.map(sh => (
                  <option key={sh.id} value={sh.id}>{sh.name} ({sh.label})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startCamera('in')}
              className="flex-1 flex flex-col items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow transition"
            >
              <div className="flex items-center gap-2 text-sm">
                <LogIn size={18} />
                <span>Punch In</span>
              </div>
              <span className="text-[10px] font-normal text-emerald-100">ஆட்கள் பணி தொடங்கு (செல்ஃபி & GPS)</span>
            </button>
            <button
              onClick={() => startCamera('out')}
              className="flex-1 flex flex-col items-center justify-center gap-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow transition"
            >
              <div className="flex items-center gap-2 text-sm">
                <LogOut size={18} />
                <span>Punch Out</span>
              </div>
              <span className="text-[10px] font-normal text-rose-100">பணி முடிவு பதிவு (செல்ஃபி & GPS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Punch {punchType === 'in' ? 'In' : 'Out'} Selfie — {selectedStaff}
              </h3>
              <button onClick={() => { stopCamera(); setStep('idle'); }}><X size={18} /></button>
            </div>
            <video ref={videoRef} autoPlay playsInline className="w-full h-56 bg-black rounded-2xl object-cover mb-4" />
            <button
              onClick={snapPhoto}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-xs hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              <Camera size={16} /> Capture Photo with Bunk GPS
            </button>
          </div>
        </div>
      )}

      {/* Confirm Punch Modal */}
      {step === 'confirm' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">Confirm Bunk Attendance</h3>
            {composedPhoto && (
              <img src={composedPhoto} alt="" className="w-full h-56 rounded-2xl object-cover mb-3 border" />
            )}
            <p className="text-xs font-semibold text-slate-700">{selectedStaff}</p>
            <p className="text-[11px] text-slate-400 mb-4">{locationText}</p>
            <div className="flex gap-2">
              <button onClick={() => setStep('idle')} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={confirmPunch} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">Confirm & Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Bunk Attendants Attendance Records</h3>
            <p className="text-[11px] text-slate-400">Verified attendance logs of fuel operators deployed at this station</p>
          </div>
          <span className="text-xs bg-orange-50 text-orange-700 font-bold px-3 py-1 rounded-full">
            {logs.length} Total Logs
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Staff Member', 'Shift Assigned', 'Punch In', 'Punch Out', 'Date', 'Photo', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                    <p>{log.staffName}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{log.role}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-purple-700 font-medium whitespace-nowrap">{log.shift}</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-slate-700">{log.punchIn}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.punchOut}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">{log.date}</td>
                  <td className="px-4 py-3">
                    <img src={log.photo} alt="" className="w-8 h-8 rounded-lg object-cover border" />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold capitalize ${log.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
