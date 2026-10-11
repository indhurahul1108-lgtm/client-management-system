// ── 3 PETROL BUNK OPERATIONAL SHIFTS (24/7) ──
export const SHIFTS = [
  {
    id: 'shift_1',
    name: 'Morning Shift',
    start: '06:00',
    end: '14:00',
    graceMins: 10,
    label: '06:00 AM - 02:00 PM',
    description: 'Bunk Fuel Dispensing & Morning Rush Hours'
  },
  {
    id: 'shift_2',
    name: 'Evening Shift',
    start: '14:00',
    end: '22:00',
    graceMins: 10,
    label: '02:00 PM - 10:00 PM',
    description: 'Peak Traffic & Fuel Attendant Operations'
  },
  {
    id: 'shift_3',
    name: 'Night Shift',
    start: '22:00',
    end: '06:00',
    graceMins: 10,
    label: '10:00 PM - 06:00 AM',
    description: 'Night Highway & 24/7 Bunk Station Coverage'
  },
];

export const SHIFT_CONFIG = {
  shiftStart: '06:00',
  shiftEnd: '14:00',
  graceMins: 10,
};

export function getShiftById(shiftId) {
  return SHIFTS.find(s => s.id === shiftId) || SHIFTS[0];
}

/**
 * Calculate how many minutes late a punch-in is against assigned or default shift.
 */
export function calcLateMinutes(
  punchIn,
  shiftStart = SHIFT_CONFIG.shiftStart,
  graceMins = SHIFT_CONFIG.graceMins,
) {
  if (!punchIn) return null;
  // Handle AM/PM or HH:MM
  let timeStr = punchIn;
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [t, m] = timeStr.split(' ');
    let [h, min] = t.split(':').map(Number);
    if (m === 'PM' && h < 12) h += 12;
    if (m === 'AM' && h === 12) h = 0;
    timeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  const [sh, sm] = shiftStart.split(':').map(Number);
  const [ph, pm] = timeStr.split(':').map(Number);
  const shiftTotalMins = sh * 60 + sm;
  const punchTotalMins = ph * 60 + pm;
  const diff = punchTotalMins - shiftTotalMins;
  if (diff <= graceMins) return 0;
  return diff;
}

export function calcStatus(punchIn, shiftStart, graceMins) {
  if (!punchIn) return 'absent';
  const late = calcLateMinutes(punchIn, shiftStart, graceMins);
  return late > 0 ? 'late' : 'present';
}

export function formatLate(mins) {
  if (mins === null || mins === undefined) return null;
  if (mins <= 0) return null;
  if (mins < 60) return `${mins} mins late`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m late` : `${h} hr late`;
}
