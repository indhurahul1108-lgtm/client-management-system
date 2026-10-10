// ── 3 SHIFT CONFIGURATIONS ──
export const SHIFTS = [
  { id: 'shift_1', name: 'Morning Shift', start: '06:00', end: '14:00', graceMins: 10, label: '06:00 AM - 02:00 PM' },
  { id: 'shift_2', name: 'General Shift', start: '10:00', end: '19:00', graceMins: 10, label: '10:00 AM - 07:00 PM' },
  { id: 'shift_3', name: 'Evening / Night Shift', start: '14:00', end: '22:00', graceMins: 10, label: '02:00 PM - 10:00 PM' },
];

export const SHIFT_CONFIG = {
  shiftStart: '10:00',
  shiftEnd: '19:00',
  graceMins: 10,
};

export function getShiftById(shiftId) {
  return SHIFTS.find(s => s.id === shiftId) || SHIFTS[1]; // default general shift
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
  const [sh, sm] = shiftStart.split(':').map(Number);
  const [ph, pm] = punchIn.split(':').map(Number);
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
