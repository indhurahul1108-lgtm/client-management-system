// ================================================================
// CLIENT DUMMY DATA — Rich data for Client Portal
// ================================================================

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => fmt(new Date(today.getTime() - n * 86400000));
const daysFromNow = (n) => fmt(new Date(today.getTime() + n * 86400000));

// ── CLIENT WORKS ──────────────────────────────────────────────
export const CLIENT_WORKS = [
  // Client C001 — Sri Tech
  { id:'w001', clientId:'c001', workId:'WRK-001', title:'E-Commerce Website Development', description:'Full-stack e-commerce platform with payment gateway, product management, and admin panel.', managerId:'m001', managerName:'Priya Nair', staffId:'s001', staffName:'Anitha Devi', startDate:'2026-09-01', dueDate: daysFromNow(5), status:'in_progress', priority:'high', progress:65, lastUpdated: daysAgo(1), notes:['Requirements gathered', 'UI designs approved', 'Backend APIs in progress'] },
  { id:'w002', clientId:'c001', workId:'WRK-002', title:'GST Filing — Q2 2026',             description:'Quarterly GST filing and reconciliation for Q2 2026.',                                managerId:'m001', managerName:'Priya Nair', staffId:'s001', staffName:'Anitha Devi', startDate:'2026-09-15', dueDate: daysAgo(3),  status:'overdue',     priority:'high', progress:40, lastUpdated: daysAgo(3), notes:['Documents received', 'Data entry in progress'] },
  { id:'w003', clientId:'c001', workId:'WRK-003', title:'Annual Audit 2025-26',              description:'Complete statutory audit for financial year 2025-26.',                                managerId:'m001', managerName:'Priya Nair', staffId:'s002', staffName:'Murugan P',   startDate:'2026-08-01', dueDate: daysAgo(10), status:'completed',    priority:'medium', progress:100, lastUpdated: daysAgo(10), notes:['Audit completed', 'Report submitted'] },

  // Client C002 — Global Traders
  { id:'w004', clientId:'c002', workId:'WRK-004', title:'IT Consulting & Infrastructure',   description:'Server setup, network configuration and IT policy documentation.',                  managerId:'m001', managerName:'Priya Nair', staffId:'s002', staffName:'Murugan P',   startDate:'2026-09-10', dueDate: daysFromNow(10), status:'in_progress', priority:'medium', progress:30, lastUpdated: daysAgo(2), notes:['Initial assessment done', 'Network audit in progress'] },
  { id:'w005', clientId:'c002', workId:'WRK-005', title:'TDS Return Filing',                 description:'TDS return filing for Q2.',                                                         managerId:'m001', managerName:'Priya Nair', staffId:'s002', staffName:'Murugan P',   startDate:'2026-09-20', dueDate: daysAgo(5),  status:'overdue',     priority:'high', progress:20, lastUpdated: daysAgo(5), notes:['Pending documents from client'] },

  // Client C003 — Prime Builders
  { id:'w006', clientId:'c003', workId:'WRK-006', title:'Website Design & Development',     description:'Corporate website with CMS, responsive design and SEO optimization.',               managerId:'m002', managerName:'Karthik Raja', staffId:'s003', staffName:'Deepa S', startDate:'2026-10-01', dueDate: daysFromNow(20), status:'pending',    priority:'low', progress:0, lastUpdated: daysAgo(0), notes:['Contract signed', 'Kickoff meeting scheduled'] },
  { id:'w007', clientId:'c003', workId:'WRK-007', title:'ROC Annual Filing',                 description:'Annual return filing with Registrar of Companies.',                                  managerId:'m002', managerName:'Karthik Raja', staffId:'s003', staffName:'Deepa S', startDate:'2026-09-01', dueDate: daysAgo(2),  status:'overdue',     priority:'high', progress:50, lastUpdated: daysAgo(2), notes:['Documents under review'] },

  // Client C004 — Sunrise Exports
  { id:'w008', clientId:'c004', workId:'WRK-008', title:'Export Documentation & Compliance','description':'Export license renewal, documentation and customs compliance.',                    managerId:'m002', managerName:'Karthik Raja', staffId:'s004', staffName:'Lavanya M', startDate:'2026-09-05', dueDate: daysFromNow(3),  status:'in_progress', priority:'high', progress:75, lastUpdated: daysAgo(1), notes:['Documents verified', 'Awaiting customs clearance'] },
  { id:'w009', clientId:'c004', workId:'WRK-009', title:'Income Tax Filing FY 2025-26',     description:'Individual income tax return filing.',                                               managerId:'m002', managerName:'Karthik Raja', staffId:'s004', staffName:'Lavanya M', startDate:'2026-09-25', dueDate: daysFromNow(15), status:'pending',    priority:'medium', progress:10, lastUpdated: daysAgo(0), notes:['Awaiting Form 16'] },
];

// ── CLIENT REQUESTS (Leave/Requests) ──────────────────────────
export const CLIENT_REQUESTS = [
  { id:'r001', clientId:'c001', type:'Meeting Request', reason:'Need to discuss project scope changes', fromDate:daysFromNow(2), toDate:daysFromNow(2), status:'pending',  appliedOn:daysAgo(1), response:null },
  { id:'r002', clientId:'c001', type:'Document Request', reason:'Need invoice copy for March 2026',    fromDate:daysAgo(5),    toDate:daysAgo(5),    status:'approved', appliedOn:daysAgo(6), response:'Document sent to your email' },
  { id:'r003', clientId:'c001', type:'Service Request',  reason:'Add social media integration to website', fromDate:daysFromNow(7), toDate:daysFromNow(14), status:'pending', appliedOn:daysAgo(2), response:null },
  { id:'r004', clientId:'c002', type:'Meeting Request', reason:'Discuss IT infrastructure roadmap',    fromDate:daysFromNow(3), toDate:daysFromNow(3), status:'approved', appliedOn:daysAgo(3), response:'Meeting confirmed at 10:00 AM' },
  { id:'r005', clientId:'c002', type:'Document Request', reason:'Need tax summary report',            fromDate:daysAgo(2),    toDate:daysAgo(2),    status:'rejected', appliedOn:daysAgo(4), response:'Please contact accounts team directly' },
  { id:'r006', clientId:'c003', type:'Service Request',  reason:'Urgent website update needed',       fromDate:daysFromNow(1), toDate:daysFromNow(1), status:'pending', appliedOn:daysAgo(0), response:null },
  { id:'r007', clientId:'c004', type:'Meeting Request', reason:'Review export documentation',          fromDate:daysFromNow(4), toDate:daysFromNow(4), status:'pending', appliedOn:daysAgo(1), response:null },
];

// ── CLIENT NOTIFICATIONS ───────────────────────────────────────
export const CLIENT_NOTIFICATIONS = [
  { id:'n001', clientId:'c001', title:'Work Status Updated',       message:'Your E-Commerce Website project is now 65% complete.', type:'work',     read:false, createdAt:`${daysAgo(0)}T09:30:00`, icon:'📊' },
  { id:'n002', clientId:'c001', title:'⚠️ Overdue Alert',          message:'GST Filing Q2 2026 is overdue by 3 days. Please provide missing documents.', type:'overdue', read:false, createdAt:`${daysAgo(0)}T08:00:00`, icon:'⚠️' },
  { id:'n003', clientId:'c001', title:'Work Completed ✅',          message:'Annual Audit 2025-26 has been successfully completed.', type:'complete', read:true,  createdAt:`${daysAgo(10)}T18:00:00`, icon:'✅' },
  { id:'n004', clientId:'c001', title:'Meeting Reminder',           message:'Your meeting request has been received and will be confirmed shortly.', type:'request', read:true, createdAt:`${daysAgo(1)}T14:00:00`, icon:'📅' },
  { id:'n005', clientId:'c001', title:'Document Available',         message:'Invoice copy for March 2026 has been sent to your email.', type:'document', read:true, createdAt:`${daysAgo(5)}T11:00:00`, icon:'📄' },
  { id:'n006', clientId:'c002', title:'New Work Assigned',          message:'IT Consulting & Infrastructure setup has been started.', type:'work', read:false, createdAt:`${daysAgo(2)}T09:00:00`, icon:'🆕' },
  { id:'n007', clientId:'c002', title:'⚠️ Overdue Alert',           message:'TDS Return Filing is overdue by 5 days. Immediate action required.', type:'overdue', read:false, createdAt:`${daysAgo(0)}T08:00:00`, icon:'⚠️' },
  { id:'n008', clientId:'c002', title:'Meeting Confirmed ✅',        message:'Your meeting on IT infrastructure has been confirmed for tomorrow 10:00 AM.', type:'request', read:false, createdAt:`${daysAgo(3)}T16:00:00`, icon:'✅' },
  { id:'n009', clientId:'c003', title:'Work Started',               message:'Website Design project has been initiated. Kickoff meeting scheduled.', type:'work', read:false, createdAt:`${daysAgo(0)}T10:00:00`, icon:'🚀' },
  { id:'n010', clientId:'c003', title:'⚠️ Overdue Alert',           message:'ROC Annual Filing is overdue by 2 days.', type:'overdue', read:false, createdAt:`${daysAgo(0)}T08:00:00`, icon:'⚠️' },
  { id:'n011', clientId:'c004', title:'Progress Update',            message:'Export Documentation is 75% complete. Expected to finish in 3 days.', type:'work', read:false, createdAt:`${daysAgo(1)}T15:00:00`, icon:'📊' },
];

// ── CLIENT MESSAGES ────────────────────────────────────────────
export const CLIENT_MESSAGES = [
  { id:'msg001', clientId:'c001', workId:'w001', sender:'client', senderName:'Sri Tech', message:'Can we add a mobile app to the project scope?', createdAt:`${daysAgo(3)}T10:00:00`, read:true },
  { id:'msg002', clientId:'c001', workId:'w001', sender:'staff',  senderName:'Anitha Devi', message:'Sure! We can discuss this in our next meeting. Please raise a service request.', createdAt:`${daysAgo(3)}T14:00:00`, read:true },
  { id:'msg003', clientId:'c001', workId:'w002', sender:'staff',  senderName:'Anitha Devi', message:'Please share the remaining GST documents at the earliest to avoid further delay.', createdAt:`${daysAgo(3)}T09:00:00`, read:false },
  { id:'msg004', clientId:'c001', workId:'w002', sender:'client', senderName:'Sri Tech',    message:'Will share by tomorrow morning.', createdAt:`${daysAgo(2)}T16:00:00`, read:true },
  { id:'msg005', clientId:'c002', workId:'w004', sender:'staff',  senderName:'Murugan P',   message:'Network audit is complete. Starting server configuration tomorrow.', createdAt:`${daysAgo(2)}T17:00:00`, read:false },
  { id:'msg006', clientId:'c002', workId:'w005', sender:'staff',  senderName:'Murugan P',   message:'TDS return is delayed due to pending documents. Please share Form 16B.', createdAt:`${daysAgo(5)}T11:00:00`, read:true },
];

// ── CLIENT DOCUMENTS ───────────────────────────────────────────
export const CLIENT_DOCUMENTS = [
  { id:'d001', clientId:'c001', name:'Service Agreement — 2026', type:'agreement', size:'245 KB', uploadedOn:daysAgo(90), url:'#', icon:'📋' },
  { id:'d002', clientId:'c001', name:'Invoice — March 2026',     type:'invoice',   size:'128 KB', uploadedOn:daysAgo(5),  url:'#', icon:'🧾' },
  { id:'d003', clientId:'c001', name:'Annual Audit Report 2025-26', type:'report', size:'1.2 MB', uploadedOn:daysAgo(10), url:'#', icon:'📊' },
  { id:'d004', clientId:'c001', name:'GST Certificate',           type:'certificate', size:'340 KB', uploadedOn:daysAgo(120), url:'#', icon:'🏆' },
  { id:'d005', clientId:'c002', name:'IT Consulting Agreement',   type:'agreement', size:'320 KB', uploadedOn:daysAgo(60), url:'#', icon:'📋' },
  { id:'d006', clientId:'c002', name:'Invoice — September 2026', type:'invoice',   size:'95 KB',  uploadedOn:daysAgo(7),  url:'#', icon:'🧾' },
  { id:'d007', clientId:'c003', name:'Website Design Agreement', type:'agreement', size:'280 KB', uploadedOn:daysAgo(3),  url:'#', icon:'📋' },
  { id:'d008', clientId:'c004', name:'Export License Copy',       type:'document',  size:'450 KB', uploadedOn:daysAgo(15), url:'#', icon:'📄' },
  { id:'d009', clientId:'c004', name:'Invoice — September 2026', type:'invoice',   size:'110 KB', uploadedOn:daysAgo(7),  url:'#', icon:'🧾' },
];

/** Get all data for a specific client */
export const getClientData = (clientId) => ({
  works:         CLIENT_WORKS.filter(w => w.clientId === clientId),
  requests:      CLIENT_REQUESTS.filter(r => r.clientId === clientId),
  notifications: CLIENT_NOTIFICATIONS.filter(n => n.clientId === clientId),
  messages:      CLIENT_MESSAGES.filter(m => m.clientId === clientId),
  documents:     CLIENT_DOCUMENTS.filter(d => d.clientId === clientId),
});

/** Calculate overdue days */
export const calcOverdueDays = (dueDate) => {
  if (!dueDate) return 0;
  const due  = new Date(dueDate);
  const now  = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now - due) / 86400000);
  return diff > 0 ? diff : 0;
};
