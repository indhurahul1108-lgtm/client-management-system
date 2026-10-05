import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_ATTENDANCE } from '../../data/dummyData.jsx';
import { Camera, MapPin, Clock, CheckCircle, LogIn, LogOut, CalendarCheck } from 'lucide-react';

function Badge({ status }) {
  const map = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function StaffAttendance() {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [punchType, setPunchType] = useState(null); // 'in' | 'out'
  const [punched, setPunched] = useState({ in: null, out: null });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('idle'); // idle | camera | location | done

  const myHistory = DUMMY_ATTENDANCE.filter(a => a.userId === user?.id);

  // Start camera
  const openCamera = async (type) => {
    setPunchType(type);
    setCapturedPhoto(null);
    setLocation(null);
    setStep('camera');
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert('Camera access denied. Please allow camera access.');
      setStep('idle');
      setCameraOpen(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCameraOpen(false);
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(dataUrl);
    stopCamera();
    setStep('location');
    getLocation();
  };

  // Get GPS location
  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) });
        setLoading(false);
        setStep('confirm');
      },
      () => {
        setLocation({ lat: '13.0827', lng: '80.2707' }); // Chennai default
        setLoading(false);
        setStep('confirm');
      }
    );
  };

  // Confirm punch
  const confirmPunch = () => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    if (punchType === 'in') {
      setPunched(p => ({ ...p, in: { time, photo: capturedPhoto, location } }));
    } else {
      setPunched(p => ({ ...p, out: { time, photo: capturedPhoto, location } }));
    }
    setCapturedPhoto(null);
    setLocation(null);
    setPunchType(null);
    setStep('idle');
  };

  return (
    <DashboardLayout title="Attendance">
      {/* Punch Card */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Today's Attendance</h2>
            <p className="text-blue-200 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Clock size={28} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-blue-200 text-xs font-medium mb-1">Punch In</p>
            <p className="text-2xl font-bold">{punched.in?.time || '—'}</p>
            {punched.in && <p className="text-blue-200 text-xs mt-1">✓ Recorded</p>}
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-blue-200 text-xs font-medium mb-1">Punch Out</p>
            <p className="text-2xl font-bold">{punched.out?.time || '—'}</p>
            {punched.out && <p className="text-blue-200 text-xs mt-1">✓ Recorded</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => openCamera('in')}
            disabled={!!punched.in}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold transition"
          >
            <LogIn size={18} /> Punch In
          </button>
          <button
            onClick={() => openCamera('out')}
            disabled={!punched.in || !!punched.out}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold transition"
          >
            <LogOut size={18} /> Punch Out
          </button>
        </div>
      </div>

      {/* Camera / Capture Modal */}
      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm">
            <div className="bg-slate-900 aspect-square relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-6 space-y-3">
              <p className="text-center text-slate-600 text-sm">Position your face clearly in the camera</p>
              <button onClick={capturePhoto} className="w-full bg-blue-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition">
                <Camera size={20} /> Capture Photo
              </button>
              <button onClick={() => { stopCamera(); setStep('idle'); }} className="w-full text-slate-500 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Location + Confirm */}
      {step === 'confirm' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg text-center">Confirm {punchType === 'in' ? 'Punch In' : 'Punch Out'}</h3>
            {capturedPhoto && (
              <img src={capturedPhoto} alt="captured" className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-blue-100" />
            )}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-3">
              <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700">Location Detected</p>
                {loading ? (
                  <p className="text-xs text-slate-400">Getting location...</p>
                ) : (
                  <p className="text-xs text-slate-500">Lat: {location?.lat}, Lng: {location?.lng}</p>
                )}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
              <Clock size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-slate-700">{new Date().toLocaleTimeString('en-IN')}</p>
            </div>
            <button onClick={confirmPunch} disabled={loading} className="w-full bg-blue-700 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-800 disabled:opacity-60 transition flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Confirm
            </button>
            <button onClick={() => setStep('idle')} className="w-full text-slate-400 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* History */}
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
