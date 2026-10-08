// ── SHIFT SETTINGS (Admin configurable via SystemSettings) ──
export const SHIFT_CONFIG = {
  shiftStart:  '10:00',  // HH:MM — shift start time
  shiftEnd:    '19:00',  // HH:MM — shift end time
  graceMins:   10,       // minutes of grace before marking late
};

/**
 * Calculate how many minutes late a punch-in is.
 * @param {string} punchIn   - "HH:MM"
 * @param {string} shiftStart - "HH:MM" (default from SHIFT_CONFIG)
 * @param {number} graceMins  - grace period in minutes
 * @returns {number|null} 0 = on time, positive = minutes late, null = absent
 */
export function calcLateMinutes(
  punchIn,
  shiftStart = SHIFT_CONFIG.shiftStart,
  graceMins  = SHIFT_CONFIG.graceMins,
) {
  if (!punchIn) return null;
  const [sh, sm] = shiftStart.split(':').map(Number);
  const [ph, pm] = punchIn.split(':').map(Number);
  const shiftTotalMins = sh * 60 + sm;
  const punchTotalMins = ph * 60 + pm;
  const diff = punchTotalMins - shiftTotalMins; // negative = early
  if (diff <= graceMins) return 0;              // within grace → on time
  return diff;                                   // minutes late
}

/**
 * Auto-determine status from punch-in time.
 * @param {string|null} punchIn
 * @returns {'present'|'late'|'absent'}
 */
export function calcStatus(punchIn, shiftStart, graceMins) {
  if (!punchIn) return 'absent';
  const late = calcLateMinutes(punchIn, shiftStart, graceMins);
  return late > 0 ? 'late' : 'present';
}

/** Format late minutes as human-readable string: "15 mins late" */
export function formatLate(mins) {
  if (mins === null || mins === undefined) return null;
  if (mins <= 0) return null;
  if (mins < 60) return `${mins} mins late`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m late` : `${h} hr late`;
}
