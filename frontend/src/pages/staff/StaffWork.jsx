import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { X, AlertTriangle, ChevronRight } from 'lucide-react';

const STATUS_COLOR = { in_progress:'bg-blue-100 text-blue-700', pending:'bg-yellow-100 text-yellow-700', completed:'bg-green-100 text-green-700', overdue:'bg-red-100 text-red-700', on_hold:'bg-slate-100 text-slate-600' };
const STATUS_LABEL = { in_progress:'In Progress', pending:'Pending', completed:'Completed', overdue:'Overdue', on_hold:'On Hold' };
const PRIORITY_COLOR = { high:'bg-red-100 text-red-700', medium:'bg-yellow-100 text-yellow-700', low:'bg-green-100 text-green-700' };

function Toast({ msg, onClose }) {
  return <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">{msg}<button onClick={onClose}><X size={12}/></button></div>;
}

export default function StaffWork() {
  const { user } = useAuth();
  const [works, setWorks] = useState(CLIENT_WORKS.filter(w => w.staffId === user?.staffId));
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [updateForm, setUpdateForm] = useState({ status: '', progress: 0, note: '' });

  const showToast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const filtered = tab === 'all' ? works : works.filter(w => {
    if (tab === 'overdue') return w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed');
    return w.status === tab;
  });

  const openDetail = (w) => {
    setSelected(w);
    setUpdateForm({ status: w.status, progress: w.progress, note: '' });
  };

  const saveUpdate = () => {
    if (!updateForm.note.trim()) { showToast('⚠️ Please add a note'); return; }
    setWorks(prev => prev.map(w => w.id === selected.id ? {
      ...w, status: updateForm.status, progress: Number(updateForm.progress),
      notes: [...(w.notes || []), `${updateForm.note} (${new Date().toLocaleDateString('en-IN')})`],
      lastUpdated: new Date().toISOString().split('T')[0]
    } : w));
    setSelected(null);
    showToast('✅ Work updated!');
  };

  const total    = works.length;
  const active   = works.filter(w => w.status === 'in_progress').length;
  const done     = works.filter(w => w.status === 'completed').length;
  const overdue  = works.filter(w => w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed')).length;

  return (
    <DashboardLayout title="My Work">
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg('')}/>}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[['Total',total,'blue'],['Active',active,'green'],['Completed',done,'purple'],['Overdue',overdue,'red']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all','in_progress','pending','completed','overdue'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${tab===t?'bg-green-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {t.replace('_',' ')}
          </button>
        ))}
      </div>

      {/* Work Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(w => {
          const isOD = w.status === 'overdue' || (calcOverdueDays(w.dueDate) > 0 && w.status !== 'completed');
          return (
            <div key={w.id} onClick={() => openDetail(w)}
              className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition ${isOD?'border-red-200 bg-red-50/20':'border-slate-100 hover:border-green-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-400 font-mono">{w.workId}</span>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">{w.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{w.managerName}</p>
                </div>
                <div className="flex flex-col gap-1.5 ml-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[w.status]||'bg-slate-100 text-slate-500'}`}>{STATUS_LABEL[w.status]||w.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${PRIORITY_COLOR[w.priority]}`}>{w.priority}</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${isOD?'bg-red-500':w.progress>=80?'bg-green-500':'bg-green-600'}`} style={{width:`${w.progress}%`}}/>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{w.progress}% complete</span>
                <span className={isOD?'text-red-600 font-bold':''}>Due: {w.dueDate}{isOD?` (+${calcOverdueDays(w.dueDate)}d)`:''}</span>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="col-span-2 text-center py-12 text-slate-400">No work in this category</div>}
      </div>

      {/* Detail + Update Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-5 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-green-300 text-xs font-mono">{selected.workId}</span>
                  <h3 className="font-bold text-lg mt-0.5">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><X size={16}/></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-600 text-sm">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Manager',selected.managerName],['Start Date',selected.startDate],['Due Date',selected.dueDate],['Priority',selected.priority]].map(([l,v])=>(
                  <div key={l}><p className="text-xs text-slate-400 font-semibold uppercase">{l}</p><p className="font-medium text-slate-700 mt-0.5 capitalize">{v||'—'}</p></div>
                ))}
              </div>

              {/* Notes timeline */}
              {selected.notes?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Update History</p>
                  {selected.notes.map((n,i) => (
                    <div key={i} className="flex items-start gap-2 mb-2 bg-slate-50 rounded-xl px-3 py-2">
                      <span className="text-green-500 mt-0.5 shrink-0 text-xs">•</span>
                      <p className="text-xs text-slate-600">{n}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Update Work Section */}
              {selected.status !== 'completed' && (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <p className="text-xs font-bold text-green-700 uppercase mb-3">Update Work Status</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">New Status</label>
                      <select value={updateForm.status} onChange={e => setUpdateForm(f=>({...f,status:e.target.value}))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Progress: {updateForm.progress}%</label>
                      <input type="range" min="0" max="100" value={updateForm.progress} onChange={e => setUpdateForm(f=>({...f,progress:e.target.value}))}
                        className="w-full accent-green-600"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Update Note *</label>
                      <textarea value={updateForm.note} onChange={e => setUpdateForm(f=>({...f,note:e.target.value}))} rows={2}
                        placeholder="What did you update?" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    </div>
                    <button onClick={saveUpdate} className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-700">Save Update</button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">📝 Note: You cannot change client or due date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
