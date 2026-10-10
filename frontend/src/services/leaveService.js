// ============================================================
//  LEAVE SERVICE
// ============================================================
import { supabase } from '../lib/supabase';

function mapLeave(l) {
  return {
    id:          l.id,
    staffId:     l.user_id,
    staffName:   l.staff_name,
    leaveType:   l.leave_type,
    fromDate:    l.from_date,
    toDate:      l.to_date,
    reason:      l.reason,
    status:      l.status,
    approvedBy:  l.approved_by,
    rejectReason:l.reject_reason,
    appliedOn:   l.applied_on,
  };
}

// ── Get all leaves (admin) ────────────────────────────────────
export async function getAllLeaves({ status } = {}) {
  let q = supabase.from('leaves').select('*').order('applied_on', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data.map(mapLeave);
}

// ── Get leaves for a user ─────────────────────────────────────
export async function getUserLeaves(userId) {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('user_id', userId)
    .order('applied_on', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(mapLeave);
}

// ── Get leaves for manager's team ─────────────────────────────
export async function getTeamLeaves(userIds, { status } = {}) {
  let q = supabase.from('leaves').select('*').in('user_id', userIds).order('applied_on', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data.map(mapLeave);
}

// ── Apply for leave ───────────────────────────────────────────
export async function applyLeave({ userId, staffName, leaveType, fromDate, toDate, reason }) {
  const { data, error } = await supabase
    .from('leaves')
    .insert([{
      user_id:    userId,
      staff_name: staffName,
      leave_type: leaveType,
      from_date:  fromDate,
      to_date:    toDate,
      reason:     reason,
      status:     'pending',
      applied_on: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();
  if (error) return { leave: null, error: error.message };
  return { leave: mapLeave(data), error: null };
}

// ── Approve leave ─────────────────────────────────────────────
export async function approveLeave(leaveId, approvedById) {
  const { error } = await supabase
    .from('leaves')
    .update({
      status:      'approved',
      approved_by: approvedById,
      approved_at: new Date().toISOString(),
    })
    .eq('id', leaveId);
  return { error: error?.message || null };
}

// ── Reject leave ──────────────────────────────────────────────
export async function rejectLeave(leaveId, approvedById, rejectReason = '') {
  const { error } = await supabase
    .from('leaves')
    .update({
      status:        'rejected',
      approved_by:   approvedById,
      approved_at:   new Date().toISOString(),
      reject_reason: rejectReason,
    })
    .eq('id', leaveId);
  return { error: error?.message || null };
}

// ── Cancel leave ──────────────────────────────────────────────
export async function cancelLeave(leaveId) {
  const { error } = await supabase
    .from('leaves')
    .update({ status: 'cancelled' })
    .eq('id', leaveId);
  return { error: error?.message || null };
}
