// ============================================================
//  ATTENDANCE SERVICE
// ============================================================
import { supabase } from '../lib/supabase';

function mapAtt(a) {
  return {
    id:           a.id,
    userId:       a.user_id,
    staffName:    a.staff_name,
    date:         a.date,
    punchIn:      a.punch_in,
    punchOut:     a.punch_out,
    photo:        a.punch_in_photo,
    punchOutPhoto:a.punch_out_photo,
    lat:          a.punch_in_lat,
    lng:          a.punch_in_lng,
    location:     a.location_name,
    status:       a.status,
    lateMinutes:  a.late_minutes || 0,
    note:         a.note,
  };
}

// ── Get all attendance (admin — with optional date filter) ────
export async function getAllAttendance({ date, status } = {}) {
  let q = supabase.from('attendance').select('*').order('date', { ascending: false });
  if (date)   q = q.eq('date', date);
  if (status && status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data.map(mapAtt);
}

// ── Get attendance for a specific user ────────────────────────
export async function getUserAttendance(userId, { months = 3 } = {}) {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - months);
  const from = fromDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .gte('date', from)
    .order('date', { ascending: false });

  if (error) { console.error(error); return []; }
  return data.map(mapAtt);
}

// ── Get TODAY's attendance for a user ─────────────────────────
export async function getTodayAttendance(userId) {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  return data ? mapAtt(data) : null;
}

// ── Get attendance for manager's team ─────────────────────────
export async function getTeamAttendance(userIds, { date } = {}) {
  let q = supabase.from('attendance').select('*').in('user_id', userIds).order('date', { ascending: false });
  if (date) q = q.eq('date', date);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data.map(mapAtt);
}

// ── Punch In ──────────────────────────────────────────────────
export async function punchIn({ userId, staffName, photo, lat, lng, location, lateMinutes, status }) {
  const today = new Date().toISOString().split('T')[0];
  const now   = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      user_id:        userId,
      staff_name:     staffName,
      date:           today,
      punch_in:       now,
      punch_in_photo: photo || null,
      punch_in_lat:   lat   || null,
      punch_in_lng:   lng   || null,
      location_name:  location || null,
      status:         status || 'present',
      late_minutes:   lateMinutes || 0,
    }, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) return { record: null, error: error.message };
  return { record: mapAtt(data), error: null };
}

// ── Punch Out ─────────────────────────────────────────────────
export async function punchOut({ userId, photo, lat, lng }) {
  const today = new Date().toISOString().split('T')[0];
  const now   = new Date().toTimeString().split(' ')[0];

  const { data, error } = await supabase
    .from('attendance')
    .update({
      punch_out:       now,
      punch_out_photo: photo || null,
      punch_out_lat:   lat   || null,
      punch_out_lng:   lng   || null,
    })
    .eq('user_id', userId)
    .eq('date', today)
    .select()
    .single();

  if (error) return { record: null, error: error.message };
  return { record: mapAtt(data), error: null };
}

// ── Admin Edit Attendance ──────────────────────────────────────
export async function adminEditAttendance(id, { punchIn, punchOut, status, lateMinutes, note, correctedBy }) {
  const { error } = await supabase
    .from('attendance')
    .update({
      punch_in:     punchIn,
      punch_out:    punchOut,
      status:       status,
      late_minutes: lateMinutes,
      note:         note,
      corrected_by: correctedBy,
    })
    .eq('id', id);
  return { error: error?.message || null };
}
