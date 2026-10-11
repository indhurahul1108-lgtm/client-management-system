// ================================================================
// CLIENT DUMMY DATA — ELAKIYAA Petrol Bunk Staffing Portal
// ================================================================

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => fmt(new Date(today.getTime() - n * 86400000));
const daysFromNow = (n) => fmt(new Date(today.getTime() + n * 86400000));

// ── CLIENT WORKS (PETROL BUNK CREW DEPLOYMENTS & OPERATIONS) ──
export const CLIENT_WORKS = [
  // Client C001 — Indian Oil Petrol Bunk (IOCL) — Anna Salai
  {
    id: 'w001',
    clientId: 'c001',
    workId: 'BUNK-001',
    title: 'Morning Shift Fuel Dispensing & Cash Collection',
    description: '3 Attendants deployed for Morning Shift (06:00 AM - 02:00 PM). Dispenser fuel filling, card payments, customer vehicle servicing.',
    managerId: 'm001',
    managerName: 'Priya Nair',
    staffId: 's001',
    staffName: 'Anitha Devi',
    startDate: '2026-10-01',
    dueDate: daysFromNow(15),
    status: 'in_progress',
    priority: 'high',
    progress: 85,
    lastUpdated: daysAgo(0),
    notes: ['Morning shift logged in at 05:55 AM', 'Tank dip measurement recorded', 'Nozzle 1 to 4 operational']
  },
  {
    id: 'w002',
    clientId: 'c001',
    workId: 'BUNK-002',
    title: 'Evening Shift Peak Hours Pump Manning',
    description: '3 Attendants deployed for Evening Shift (02:00 PM - 10:00 PM). Fast fueling, digital UPI/POS settlement, shift handover reconciliation.',
    managerId: 'm001',
    managerName: 'Priya Nair',
    staffId: 's002',
    staffName: 'Murugan P',
    startDate: '2026-10-01',
    dueDate: daysFromNow(15),
    status: 'in_progress',
    priority: 'high',
    progress: 75,
    lastUpdated: daysAgo(0),
    notes: ['Evening shift on duty', 'Peak commute fuel volume handled', 'Cash handover matched with meter reading']
  },
  {
    id: 'w003',
    clientId: 'c001',
    workId: 'BUNK-003',
    title: 'Night Shift 24/7 Bunk Coverage (10 PM - 6 AM)',
    description: '2 Attendants deployed for Night Shift (10:00 PM - 06:00 AM). Highway vehicle fueling, diesel dispensing for trucks, fire safety watch.',
    managerId: 'm001',
    managerName: 'Priya Nair',
    staffId: 's008',
    staffName: 'Vijay S',
    startDate: '2026-10-01',
    dueDate: daysFromNow(20),
    status: 'in_progress',
    priority: 'high',
    progress: 90,
    lastUpdated: daysAgo(1),
    notes: ['Night team on duty', 'Security lights checked', 'Diesel truck lane active']
  },
  {
    id: 'w004',
    clientId: 'c001',
    workId: 'BUNK-004',
    title: 'Daily Tank Dip & Density Testing Report',
    description: 'Daily morning density check of MS (Petrol) & HSD (Diesel) tanks, dip rod reading and temperature compensation log.',
    managerId: 'm001',
    managerName: 'Priya Nair',
    staffId: 's001',
    staffName: 'Anitha Devi',
    startDate: daysAgo(7),
    dueDate: daysAgo(1),
    status: 'completed',
    priority: 'medium',
    progress: 100,
    lastUpdated: daysAgo(1),
    notes: ['Tank 1 Petrol Density: 742 kg/m3 (Verified)', 'Tank 2 Diesel Density: 825 kg/m3 (Verified)', 'Report signed by Bunk Manager']
  },

  // Client C002 — Bharat Petroleum Pump (BPCL) — Guindy
  {
    id: 'w005',
    clientId: 'c002',
    workId: 'BUNK-005',
    title: '3-Shift 24/7 Bunk Staffing Supply',
    description: 'Continuous 5 attendants deployed across Morning, Evening, and Night shifts for BPCL Industrial hub.',
    managerId: 'm001',
    managerName: 'Priya Nair',
    staffId: 's004',
    staffName: 'Ravi Kumar',
    startDate: '2026-10-01',
    dueDate: daysFromNow(20),
    status: 'in_progress',
    priority: 'high',
    progress: 80,
    lastUpdated: daysAgo(0),
    notes: ['All 3 shifts running smoothly', 'Attendance verified with camera & GPS']
  },

  // Client C003 — HPCL 24/7 Fuel Station — OMR
  {
    id: 'w006',
    clientId: 'c003',
    workId: 'BUNK-006',
    title: 'OMR Highway Night Shift Attendants Team',
    description: '2 Dedicated night operators for 24-hour IT highway traffic coverage.',
    managerId: 'm002',
    managerName: 'Karthik Raja',
    staffId: 's003',
    staffName: 'Deepa S',
    startDate: '2026-10-01',
    dueDate: daysFromNow(25),
    status: 'in_progress',
    priority: 'medium',
    progress: 60,
    lastUpdated: daysAgo(0),
    notes: ['Highway fueling active', 'POS card swipe reconciliation verified']
  },
];

// ── CLIENT REQUESTS (BUNK MANPOWER & REPLACEMENTS) ───────────
export const CLIENT_REQUESTS = [
  { id: 'r001', clientId: 'c001', type: 'Extra Attendant Request', reason: 'Need 2 extra fuel attendants for Diwali festival rush (Morning & Evening shift)', fromDate: daysFromNow(3), toDate: daysFromNow(7), status: 'pending', appliedOn: daysAgo(1), response: null },
  { id: 'r002', clientId: 'c001', type: 'Shift Replacement Request', reason: 'Night operator replacement required for Sunday', fromDate: daysFromNow(1), toDate: daysFromNow(1), status: 'approved', appliedOn: daysAgo(2), response: 'Vijay S assigned as replacement operator' },
  { id: 'r003', clientId: 'c001', type: 'Monthly Staffing Renewal', reason: 'Renew 6 bunk attendants deployment contract for November 2026', fromDate: daysFromNow(15), toDate: daysFromNow(45), status: 'pending', appliedOn: daysAgo(0), response: null },
  { id: 'r004', clientId: 'c002', type: 'Cashier Deployment Request', reason: 'Require trained cashier for BPCL digital POS & billing terminal', fromDate: daysFromNow(2), toDate: daysFromNow(30), status: 'approved', appliedOn: daysAgo(3), response: 'Murugan P assigned for cash & POS management' },
  { id: 'r005', clientId: 'c003', type: 'Emergency Shift Coverage', reason: 'Urgent night shift attendant required due to staff medical emergency', fromDate: daysFromNow(0), toDate: daysFromNow(2), status: 'approved', appliedOn: daysAgo(0), response: 'Emergency operator deployed within 2 hours' },
];

// ── CLIENT NOTIFICATIONS (BUNK SPECIFIC) ───────────────────────
export const CLIENT_NOTIFICATIONS = [
  { id: 'n001', clientId: 'c001', title: 'Shift Punch-In Recorded', message: 'Anitha Devi punched in for Morning Shift at 05:55 AM (Camera & GPS Verified).', type: 'attend', read: false, createdAt: `${daysAgo(0)}T06:00:00`, icon: '⛽' },
  { id: 'n002', clientId: 'c001', title: 'Bunk Crew Allocation Confirmed', message: 'ELAKIYAA deployed 4 attendants across Morning, Evening and Night shifts today.', type: 'work', read: false, createdAt: `${daysAgo(0)}T07:00:00`, icon: '👥' },
  { id: 'n003', clientId: 'c001', title: 'October Manpower Bill Generated', message: 'Monthly staffing bill for October 2026 (₹1,35,000) is ready for review.', type: 'billing', read: true, createdAt: `${daysAgo(2)}T10:00:00`, icon: '💰' },
  { id: 'n004', clientId: 'c001', title: 'Shift Replacement Approved ✅', message: 'Replacement attendant Vijay S confirmed for Sunday night shift.', type: 'request', read: true, createdAt: `${daysAgo(1)}T14:00:00`, icon: '✅' },
  { id: 'n005', clientId: 'c002', title: 'BPCL Bunk Attendance Verified', message: 'Evening shift crew reported on time at Guindy fuel pump.', type: 'attend', read: false, createdAt: `${daysAgo(0)}T14:05:00`, icon: '⛽' },
];

// ── CLIENT MESSAGES ───────────────────────────────────────────
export const CLIENT_MESSAGES = [
  { id: 'msg001', clientId: 'c001', workId: 'w001', sender: 'client', senderName: 'Indian Oil Bunk Manager', message: 'Please ensure 2 operators are stationed at the diesel bay during morning peak hours.', createdAt: `${daysAgo(2)}T08:30:00`, read: true },
  { id: 'msg002', clientId: 'c001', workId: 'w001', sender: 'staff', senderName: 'Priya Nair (Manager)', message: 'Noted sir! Anitha Devi and Deepa S are assigned specifically to diesel bays 1 & 2.', createdAt: `${daysAgo(2)}T09:00:00`, read: true },
  { id: 'msg003', clientId: 'c001', workId: 'w002', sender: 'client', senderName: 'Indian Oil Bunk Manager', message: 'Do we have backup staff for the upcoming festival weekend?', createdAt: `${daysAgo(1)}T11:00:00`, read: true },
  { id: 'msg004', clientId: 'c001', workId: 'w002', sender: 'staff', senderName: 'Priya Nair (Manager)', message: 'Yes, 2 standby fuel operators are reserved for your pump station.', createdAt: `${daysAgo(1)}T11:30:00`, read: true },
];

// ── CLIENT DOCUMENTS (BUNK BILLING & CONTRACTS) ────────────────
export const CLIENT_DOCUMENTS = [
  { id: 'd001', clientId: 'c001', name: 'Manpower Supply Agreement 2026 - Indian Oil Bunk', type: 'Agreement', size: '2.4 MB', date: '2026-01-15', icon: '📋' },
  { id: 'd002', clientId: 'c001', name: 'Staffing Invoice - October 2026', type: 'Invoice', size: '380 KB', date: '2026-10-01', icon: '💰' },
  { id: 'd003', clientId: 'c001', name: 'Staffing Invoice - September 2026', type: 'Invoice', size: '375 KB', date: '2026-09-01', icon: '💰' },
  { id: 'd004', clientId: 'c001', name: 'Staffing Invoice - August 2026', type: 'Invoice', size: '360 KB', date: '2026-08-01', icon: '💰' },
  { id: 'd005', clientId: 'c001', name: 'Bunk Attendants KYC & Verification Dossier', type: 'Certificate', size: '4.8 MB', date: '2026-02-10', icon: '🛡️' },
  { id: 'd006', clientId: 'c001', name: 'Safety Training & Fire Extinguisher Handling Certificate', type: 'Certificate', size: '1.2 MB', date: '2026-03-05', icon: '🧯' },
];

export function getClientData(clientId = 'c001') {
  const cId = clientId.toLowerCase();
  return {
    works: CLIENT_WORKS.filter(w => w.clientId === cId),
    requests: CLIENT_REQUESTS.filter(r => r.clientId === cId),
    notifications: CLIENT_NOTIFICATIONS.filter(n => n.clientId === cId),
    messages: CLIENT_MESSAGES.filter(m => m.clientId === cId),
    documents: CLIENT_DOCUMENTS.filter(d => d.clientId === cId),
  };
}

export function calcOverdueDays(dueDate) {
  if (!dueDate) return 0;
  const diff = Math.floor((new Date() - new Date(dueDate)) / 86400000);
  return diff > 0 ? diff : 0;
}
