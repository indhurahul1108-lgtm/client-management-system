import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getClientData } from '../../data/clientData.js';
import { DUMMY_USERS } from '../../data/dummyData.jsx';

export default function ClientMessages() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const works = data.works;
  const [selectedWorkId, setSelectedWorkId] = useState(works[0]?.id || '');
  const [messages, setMessages] = useState(data.messages);
  const [newMsg, setNewMsg] = useState('');
  const bottomRef = useRef(null);

  const getStaff = (staffId) => DUMMY_USERS.find((u) => u.staffId === staffId);

  const currentWork = works.find((w) => w.id === selectedWorkId);
  const workMessages = messages.filter((m) => m.workId === selectedWorkId);

  const formatTime = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (createdAt) => {
    const d = new Date(createdAt);
    const todayStr = new Date().toISOString().split('T')[0];
    const msgStr = createdAt.split('T')[0];
    if (msgStr === todayStr) return 'Today';
    const yStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (msgStr === yStr) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const sendMessage = () => {
    const text = newMsg.trim();
    if (!text) return;

    const now = new Date().toISOString();
    const msg = {
      id: `msg${Date.now()}`,
      clientId: user?.clientId || 'c001',
      workId: selectedWorkId,
      sender: 'client',
      senderName: user?.name || 'Client',
      message: text,
      createdAt: now,
      read: true,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mark unread staff messages as read when work is selected
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.workId === selectedWorkId && m.sender === 'staff' ? { ...m, read: true } : m
      )
    );
  }, [selectedWorkId]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [workMessages.length]);

  // Group messages by date
  const grouped = [];
  let lastDate = '';
  workMessages.forEach((m) => {
    const d = formatDate(m.createdAt);
    if (d !== lastDate) {
      grouped.push({ type: 'divider', label: d });
      lastDate = d;
    }
    grouped.push({ type: 'message', data: m });
  });

  const unreadCount = (workId) =>
    messages.filter((m) => m.workId === workId && m.sender === 'staff' && !m.read).length;

  return (
    <DashboardLayout title="Messages">
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        {/* Work Selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-600 mb-2">Select Work</label>
          <select
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
          >
            {works.map((w) => {
              const cnt = unreadCount(w.id);
              return (
                <option key={w.id} value={w.id}>
                  {w.workId} — {w.title}{cnt > 0 ? ` (${cnt} new)` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Chat Header */}
          {currentWork && (
            <div className="bg-orange-500 text-white px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base font-bold">
                💬
              </div>
              <div>
                <p className="font-semibold text-sm">{currentWork.title}</p>
                <p className="text-xs text-orange-100">Staff: {currentWork.staffName}</p>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-lg font-medium">No messages for this work yet</p>
                <p className="text-sm mt-1">Start a conversation below</p>
              </div>
            ) : (
              grouped.map((item, idx) => {
                if (item.type === 'divider') {
                  return (
                    <div key={`div-${idx}`} className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.label}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  );
                }

                const m = item.data;
                const isClient = m.sender === 'client';
                return (
                  <div key={m.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-[75%] flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                      {/* Sender */}
                      <span className="text-xs text-slate-400 mb-1 px-1">{m.senderName}</span>

                      {/* Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isClient
                            ? 'bg-orange-500 text-white rounded-br-sm'
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                        }`}
                      >
                        {m.message}
                      </div>

                      {/* Time + unread dot */}
                      <div className="flex items-center gap-1.5 mt-1 px-1">
                        {!isClient && !m.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        <span className="text-xs text-slate-400">{formatTime(m.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white px-4 py-3 flex items-end gap-3">
            <textarea
              rows={1}
              placeholder="Type a message... (Enter to send)"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-slate-50 min-h-[44px] max-h-[120px]"
            />
            <button
              onClick={sendMessage}
              disabled={!newMsg.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl transition-colors min-h-[44px] flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
