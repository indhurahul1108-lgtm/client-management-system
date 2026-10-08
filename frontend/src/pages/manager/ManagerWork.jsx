import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { CLIENT_WORKS, calcOverdueDays } from '../../data/clientData.js';
import { Plus, X, AlertTriangle, ChevronDown } from 'lucide-react';

const STATUS_COLORS = { in_progress:'bg-blue-100 text-blue-700', pending:'bg-yellow-100 text-yellow-700', completed:'bg-green-100 text-green-700', overdue:'bg-red-100 text-red-700', on_hold:'bg-slate-100 text-slate-600', cancelled:'bg-gray-100 text-gray-600' };
const PRIORITY_COLORS = { high:'bg-red-100 text-red-700', medium:'bg-yellow-100 text-yellow-700', low:'bg-green-100 text-green-700' };
const STATUS_LABELS = { in_progress:'In Progress', pending:'Pending', completed:'Completed', overdue:'Overdue', on_hold:'On Hold', cancelled:'Cancelled' };
const TABS = ['all','pending','in_progress','completed','overdue'];

function Toast({msg,onClose}){return(<div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold"><span>{msg}</span><button onClick={onClose}><X size={14}/></button></div>);}

export default function ManagerWork() {
  const { user } = useAuth();
  const mId = user?.managerId || 'm001';
  const myStaff = DUMMY_USERS.filter(u => u.role==='staff' && u.managerId===mId);
  const myStaffIds = myStaff.map(s=>s.staffId);
  const myClients = DUMMY_USERS.filter(u=>u.role==='client' && myStaffIds.includes(u.assignedStaffId));

  const [tab, setTab] = useState('all');
  const [works, setWorks] = useState(CLIENT_WORKS.filter(w=>myStaffIds.includes(w.staffId)));
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [form, setForm] = useState({ clientId:'', title:'', description:'', staffId:'', dueDate:'', priority:'medium' });

  const showToast = msg => { setToastMsg(msg); setTimeout(()=>setToastMsg(''),3000); };

  const filtered = tab==='all' ? works : works.filter(w => {
    if (tab==='overdue') return w.status==='overdue' || (calcOverdueDays(w.dueDate)>0 && w.status!=='completed');
    return w.status===tab;
  });

  const addWork = () => {
    if (!form.clientId || !form.title || !form.staffId || !form.dueDate) { showToast('⚠️ Fill all required fields'); return; }
    const client = myClients.find(c=>c.clientId===form.clientId);
    const staff  = myStaff.find(s=>s.staffId===form.staffId);
    const newWork = { id:`w${Date.now()}`, clientId:form.clientId, workId:`WRK-${Math.floor(Math.random()*900)+100}`, title:form.title, description:form.description, managerId:mId, managerName:user?.name, staffId:form.staffId, staffName:staff?.name, startDate:new Date().toISOString().split('T')[0], dueDate:form.dueDate, status:'pending', priority:form.priority, progress:0, lastUpdated:new Date().toISOString().split('T')[0], notes:['Work created'] };
    setWorks(prev=>[newWork,...prev]);
    setForm({clientId:'',title:'',description:'',staffId:'',dueDate:'',priority:'medium'});
    setShowAdd(false);
    showToast('✅ Work assigned successfully!');
  };

  const totalW     = works.length;
  const activeW    = works.filter(w=>w.status==='in_progress').length;
  const completedW = works.filter(w=>w.status==='completed').length;
  const overdueW   = works.filter(w=>w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed')).length;

  return (
    <DashboardLayout title="Work / Tasks">
      {toastMsg && <Toast msg={toastMsg} onClose={()=>setToastMsg('')}/>}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[['Total',totalW,'blue'],['Active',activeW,'green'],['Completed',completedW,'purple'],['Overdue',overdueW,'red']].map(([l,v,c])=>(
          <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-2xl p-4`}>
            <p className={`text-2xl font-bold text-${c}-800`}>{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Add Button */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${tab===t?'bg-purple-700 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {t.replace('_',' ')}
          </button>
        ))}
        <button onClick={()=>setShowAdd(true)} className="ml-auto flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-800">
          <Plus size={15}/> Assign Work
        </button>
      </div>

      {/* Work Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(w=>{
          const isOD = w.status==='overdue'||(calcOverdueDays(w.dueDate)>0&&w.status!=='completed');
          return (
            <div key={w.id} onClick={()=>setSelected(w)}
              className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition ${isOD?'border-red-200 bg-red-50/20':'border-slate-100 hover:border-purple-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-slate-400 font-mono">{w.workId}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{w.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{w.staffName}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[w.status]||'bg-slate-100 text-slate-500'}`}>{STATUS_LABELS[w.status]||w.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${PRIORITY_COLORS[w.priority]}`}>{w.priority}</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${isOD?'bg-red-500':w.progress>=80?'bg-green-500':'bg-purple-500'}`} style={{width:`${w.progress}%`}}/>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{w.progress}% complete</span>
                <span className={isOD?'text-red-600 font-bold':''}>Due: {w.dueDate} {isOD?`(+${calcOverdueDays(w.dueDate)}d)`:''}</span>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="col-span-2 text-center py-12 text-slate-400">No work found</div>}
      </div>

      {/* Work Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-300 text-xs font-mono">{selected.workId}</span>
                  <h3 className="font-bold text-lg mt-0.5">{selected.title}</h3>
                </div>
                <button onClick={()=>setSelected(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><X size={16}/></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${PRIORITY_COLORS[selected.priority]}`}>{selected.priority} Priority</span>
              </div>
              <p className="text-slate-600 text-sm">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Staff',selected.staffName],['Manager',selected.managerName],['Start',selected.startDate],['Due',selected.dueDate]].map(([l,v])=>(
                  <div key={l}><p className="text-xs text-slate-400 font-semibold uppercase">{l}</p><p className="font-medium text-slate-700 mt-0.5">{v||'—'}</p></div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Progress</p>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full flex items-center justify-end pr-1.5" style={{width:`${selected.progress}%`}}>
                    <span className="text-white text-xs font-bold leading-none">{selected.progress}%</span>
                  </div>
                </div>
              </div>
              {selected.notes && selected.notes.length>0 && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Updates / Notes</p>
                  <div className="space-y-2">
                    {selected.notes.map((n,i)=>(
                      <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-xl px-3 py-2">
                        <span className="text-purple-500 mt-0.5 shrink-0">•</span>
                        <p className="text-sm text-slate-600">{n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Work Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">Assign New Work</h3>
              <button onClick={()=>setShowAdd(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              {[
                {label:'Work Title *',type:'text',key:'title',placeholder:'Enter work title'},
                {label:'Description',type:'text',key:'description',placeholder:'Brief description'},
                {label:'Due Date *',type:'date',key:'dueDate'},
              ].map(f=>(
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Client *</label>
                <select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="">Select Client...</option>
                  {myClients.map(c=><option key={c.clientId} value={c.clientId}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Assign Staff *</label>
                <select value={form.staffId} onChange={e=>setForm(p=>({...p,staffId:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="">Select Staff...</option>
                  {myStaff.map(s=><option key={s.staffId} value={s.staffId}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Priority</label>
                <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  {['low','medium','high'].map(p=><option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm">Cancel</button>
              <button onClick={addWork} className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-bold hover:bg-purple-800">Assign</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
