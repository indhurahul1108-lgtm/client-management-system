// ============================================================
//  NOTIFICATIONS SERVICE
// ============================================================
import { supabase } from '../lib/supabase';

function mapNotif(n) {
  return {
    id:        n.id,
    title:     n.title,
    msg:       n.message,
    type:      n.type,
    icon:      n.icon || '🔔',
    unread:    !n.is_read,
    time:      n.created_at,
  };
}

// ── Get notifications for a user ─────────────────────────────
export async function getUserNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error(error); return []; }
  return data.map(mapNotif);
}

// ── Mark as read ──────────────────────────────────────────────
export async function markNotifRead(notifId) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
}

// ── Mark all as read ──────────────────────────────────────────
export async function markAllNotifsRead(userId) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}

// ── Send notification to a user ───────────────────────────────
export async function sendNotification({ userId, title, message, type, icon }) {
  const { error } = await supabase.from('notifications').insert([{
    user_id: userId, title, message, type, icon: icon || '🔔', is_read: false,
  }]);
  return { error: error?.message || null };
}

// ── SALARY SERVICE ────────────────────────────────────────────
export async function getAllSalaries() {
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .order('month', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(s => ({
    id: s.id, staffId: s.user_id, staffName: s.staff_name,
    month: s.month, basic: s.basic, allowance: s.allowance,
    deduction: s.deduction, netSalary: s.net_salary,
    status: s.status, paidOn: s.paid_on,
  }));
}

export async function getUserSalaries(userId) {
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(s => ({
    id: s.id, staffId: s.user_id, staffName: s.staff_name,
    month: s.month, basic: s.basic, allowance: s.allowance,
    deduction: s.deduction, netSalary: s.net_salary,
    status: s.status, paidOn: s.paid_on,
  }));
}

export async function markSalaryPaid(salaryId) {
  const { error } = await supabase
    .from('salaries')
    .update({ status: 'paid', paid_on: new Date().toISOString().split('T')[0] })
    .eq('id', salaryId);
  return { error: error?.message || null };
}

// ── CLIENT REQUESTS SERVICE ───────────────────────────────────
export async function getClientRequests(clientUuid) {
  const { data, error } = await supabase
    .from('client_requests')
    .select('*')
    .eq('client_uuid', clientUuid)
    .order('applied_on', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(r => ({
    id: r.id, clientId: r.client_id, requestType: r.request_type,
    reason: r.reason, fromDate: r.from_date, toDate: r.to_date,
    status: r.status, response: r.response, appliedOn: r.applied_on,
  }));
}

export async function submitClientRequest({ clientUuid, clientId, requestType, reason, fromDate, toDate }) {
  const { data, error } = await supabase
    .from('client_requests')
    .insert([{
      client_uuid: clientUuid, client_id: clientId,
      request_type: requestType, reason, from_date: fromDate, to_date: toDate,
      status: 'pending', applied_on: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();
  if (error) return { request: null, error: error.message };
  return { request: data, error: null };
}

// ── MESSAGES SERVICE ──────────────────────────────────────────
export async function getWorkMessages(workUuid) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('work_uuid', workUuid)
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(m => ({
    id: m.id, workUuid: m.work_uuid, senderId: m.sender_id,
    senderRole: m.sender_role, senderName: m.sender_name,
    message: m.message, isRead: m.is_read, time: m.created_at,
  }));
}

export async function sendMessage({ workUuid, senderId, senderRole, senderName, message }) {
  const { error } = await supabase.from('messages').insert([{
    work_uuid: workUuid, sender_id: senderId, sender_role: senderRole,
    sender_name: senderName, message, is_read: false,
  }]);
  return { error: error?.message || null };
}

// ── DOCUMENTS SERVICE ─────────────────────────────────────────
export async function getClientDocuments(clientUuid) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_uuid', clientUuid)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(d => ({
    id: d.id, name: d.name, type: d.type,
    fileUrl: d.file_url, fileSize: d.file_size,
    icon: d.icon || '📄', date: d.created_at?.split('T')[0],
  }));
}

// ── AUDIT LOG SERVICE ─────────────────────────────────────────
export async function addAuditLog({ userId, userName, action, module, description, ipAddress }) {
  await supabase.from('audit_logs').insert([{
    user_id: userId, user_name: userName, action, module, description, ip_address: ipAddress,
  }]);
}

export async function getAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) { console.error(error); return []; }
  return data.map(l => ({
    id: l.id, userId: l.user_id, user: l.user_name, action: l.action,
    module: l.module, desc: l.description, ip: l.ip_address, time: l.created_at,
  }));
}

// ── SYSTEM SETTINGS ───────────────────────────────────────────
export async function getSettings() {
  const { data } = await supabase.from('system_settings').select('*');
  if (!data) return {};
  return Object.fromEntries(data.map(s => [s.key, s.value]));
}

export async function updateSetting(key, value, updatedByUuid) {
  await supabase.from('system_settings').upsert(
    { key, value, updated_by: updatedByUuid, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  );
}
