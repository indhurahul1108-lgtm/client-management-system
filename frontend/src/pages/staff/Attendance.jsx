import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { Camera, MapPin, Clock, CheckCircle, LogIn, LogOut, CalendarCheck, X } from 'lucide-react';

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function StaffAttendance() {
  const { user } = useAuth();
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [punchType,     setPunchType]     = useState(null);   // 'in' | 'out'
  const [step,          setStep]          = useState('idle'); // idle | camera | composing | confirm
  const [composedPhoto, setComposedPhoto] = useState(null);  // final photo with overlay
  const [location,      setLocation]      = useState(null);
  const [locationText,  setLocationText]  = useState('');
  const [loadingLoc,    setLoadingLoc]    = useState(false);
  const [punched,       setPunched]       = useState({ in: null, out: null });

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
    // Truncate location text if too long
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
        videoRef.current.style.transform = 'scaleX(-1)'; // mirror preview
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

        // Try reverse geocode (free Nominatim API)
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
    const now  = new Date();
    const time = now.toTimeString().slice(0, 5);
    if (punchType === 'in') {
      setPunched(p => ({ ...p, in: { time, photo: composedPhoto, location } }));
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

      {/* ── Punch Card ── */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Today's Attendance</h2>
            <p className="text-blue-200 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-blue-200 text-xs font-medium mb-1">Punch In</p>
            <p className="text-2xl font-bold">{punched.in?.time || '—'}</p>
            {punched.in && <p className="text-green-300 text-xs mt-1">✓ Recorded</p>}
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-blue-200 text-xs font-medium mb-1">Punch Out</p>
            <p className="text-2xl font-bold">{punched.out?.time || '—'}</p>
            {punched.out && <p className="text-green-300 text-xs mt-1">✓ Recorded</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => openCamera('in')} disabled={!!punched.in}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold transition text-sm">
            <LogIn size={17} /> Punch In
          </button>
          <button onClick={() => openCamera('out')} disabled={!punched.in || !!punched.out}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold transition text-sm">
            <LogOut size={17} /> Punch Out
          </button>
        </div>
      </div>

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

      {/* ── Attendance History (no photos — admin only sees photos) ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">My Attendance History</h2>
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
    </DashboardLayout>
  );
}
