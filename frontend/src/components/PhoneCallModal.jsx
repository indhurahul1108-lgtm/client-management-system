import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, Copy, Check, MessageSquare, Volume2, ShieldCheck, X } from 'lucide-react';

export default function PhoneCallModal({ isOpen, onClose, contact }) {
  const [callState, setCallState] = useState('connecting'); // 'connecting' | 'ringing' | 'connected' | 'ended'
  const [seconds, setSeconds] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallState('connecting');
      setSeconds(0);
      return;
    }

    setCallState('connecting');
    setSeconds(0);

    const t1 = setTimeout(() => {
      setCallState('ringing');
    }, 1500);

    const t2 = setTimeout(() => {
      setCallState('connected');
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  useEffect(() => {
    let interval = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen || !contact) return null;

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.mobile || '9000000004');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleDialApp = () => {
    window.location.href = `tel:${contact.mobile || '9000000004'}`;
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello ${contact.name}, this is regarding petrol bunk duty from ELAKIYAA portal.`);
    window.open(`https://wa.me/91${contact.mobile || '9000000004'}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm text-white shadow-2xl overflow-hidden relative">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <ShieldCheck size={14} />
            <span>ELAKIYAA Secure Calling</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Center Calling UI */}
        <div className="p-8 text-center flex flex-col items-center">
          
          {/* Avatar with pulsing rings */}
          <div className="relative mb-5">
            {callState !== 'ended' && (
              <>
                <div className={`absolute -inset-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-500/20 animate-ping' : 'bg-amber-500/20 animate-ping'}`} />
                <div className={`absolute -inset-5 rounded-full ${callState === 'connected' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`} />
              </>
            )}
            <img
              src={contact.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=16a34a&color=fff`}
              alt={contact.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-2xl relative z-10"
            />
            <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center z-20 ${
              callState === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}>
              <Phone size={12} className="text-white fill-current" />
            </div>
          </div>

          {/* Contact Details */}
          <h3 className="text-xl font-bold tracking-wide">{contact.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{contact.role || 'Field Supervising Staff'}</p>
          {contact.bunk && (
            <p className="text-[11px] text-amber-300 mt-1 font-semibold">{contact.bunk}</p>
          )}

          {/* Phone Number Display */}
          <div className="mt-3 flex items-center justify-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <span className="font-mono text-sm font-bold text-slate-200 tracking-wider">
              📞 +91 {contact.mobile || '90000 00004'}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 hover:text-emerald-400 text-slate-400 transition"
              title="Copy number"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Call Status Badge */}
          <div className="mt-5">
            {callState === 'connecting' && (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-2 bg-amber-950/60 border border-amber-800/80 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Connecting to Supervisor Line...
              </span>
            )}
            {callState === 'ringing' && (
              <span className="text-xs font-bold text-blue-400 flex items-center gap-2 bg-blue-950/60 border border-blue-800/80 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Ringing Phone (+91 {contact.mobile})...
              </span>
            )}
            {callState === 'connected' && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Call Connected · {formatTimer(seconds)}
                </span>
                <p className="text-[10px] text-emerald-300">Staff Supervisor Online</p>
              </div>
            )}
            {callState === 'ended' && (
              <span className="text-xs font-bold text-red-400 flex items-center gap-2 bg-red-950/60 border border-red-800/80 px-4 py-1.5 rounded-full">
                Call Ended
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            {/* Direct Dial on Mobile/PC */}
            <button
              onClick={handleDialApp}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-md"
            >
              <PhoneCall size={14} />
              <span>Direct Dial</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-md"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* End Call / Close button */}
          <button
            onClick={handleEndCall}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
          >
            <PhoneOff size={15} />
            <span>End Call / Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
