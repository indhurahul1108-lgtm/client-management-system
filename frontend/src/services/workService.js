// ============================================================
//  WORKS SERVICE
// ============================================================
import { supabase } from '../lib/supabase';

function mapWork(w) {
  return {
    id:          w.id,
    workId:      w.work_id,
    title:       w.title,
    description: w.description,
    clientId:    w.client_id,
    clientUuid:  w.client_uuid,
    staffId:     w.staff_id,
    staffUuid:   w.staff_uuid,
    managerId:   w.manager_id,
    managerUuid: w.manager_uuid,
    staffName:   w.staff_name,
    managerName: w.manager_name,
    startDate:   w.start_date,
    dueDate:     w.due_date,
    status:      w.status,
    priority:    w.priority,
    progress:    w.progress,
    lastUpdated: w.last_updated,
    notes:       w.work_notes?.map(n => n.note) || [],
  };
}

// Overdue days calculation (same logic as dummyData)
export function calcOverdueDays(dueDate) {
  if (!dueDate) return 0;
  const due   = new Date(dueDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);
  const diff = Math.floor((today - due) / 86400000);
  return diff > 0 ? diff : 0;
}

// ── Get all works (admin) ─────────────────────────────────────
export async function getAllWorks() {
  const { data, error } = await supabase
    .from('works')
    .select('*, work_notes(note, created_at)')
    .order('due_date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(mapWork);
}

// ── Get works for a client ────────────────────────────────────
export async function getClientWorks(clientUuid) {
  const { data, error } = await supabase
    .from('works')
    .select('*, work_notes(note, created_at)')
    .eq('client_uuid', clientUuid)
    .order('due_date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(mapWork);
}

// ── Get works for a staff member ──────────────────────────────
export async function getStaffWorks(staffUuid) {
  const { data, error } = await supabase
    .from('works')
    .select('*, work_notes(note, created_at)')
    .eq('staff_uuid', staffUuid)
    .order('due_date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(mapWork);
}

// ── Get works for manager's team ──────────────────────────────
export async function getTeamWorks(staffUuids) {
  const { data, error } = await supabase
    .from('works')
    .select('*, work_notes(note, created_at)')
    .in('staff_uuid', staffUuids)
    .order('due_date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(mapWork);
}

// ── Assign new work (admin/manager) ──────────────────────────
export async function assignWork(form) {
  // Generate work_id
  const { count } = await supabase.from('works').select('*', { count: 'exact', head: true });
  const workId = `WRK-${String((count || 0) + 1).padStart(3, '0')}`;

  const { data, error } = await supabase
    .from('works')
    .insert([{
      work_id:     workId,
      title:       form.title,
      description: form.description,
      client_id:   form.clientId,
      client_uuid: form.clientUuid,
      staff_id:    form.staffId,
      staff_uuid:  form.staffUuid,
      manager_id:  form.managerId,
      manager_uuid:form.managerUuid,
      staff_name:  form.staffName,
      manager_name:form.managerName,
      start_date:  new Date().toISOString().split('T')[0],
      due_date:    form.dueDate,
      status:      'pending',
      priority:    form.priority || 'medium',
      progress:    0,
    }])
    .select()
    .single();
  if (error) return { work: null, error: error.message };
  return { work: mapWork(data), error: null };
}

// ── Update work status / progress ────────────────────────────
export async function updateWork(workId, { status, progress, note, updatedByUuid }) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('works')
    .update({ status, progress, last_updated: today })
    .eq('id', workId)
    .select()
    .single();

  if (error) return { error: error.message };

  // Add note if provided
  if (note) {
    await supabase.from('work_notes').insert([{ work_id: workId, note, added_by: updatedByUuid }]);
  }

  return { work: mapWork(data), error: null };
}

// ── Get overdue works ─────────────────────────────────────────
export async function getOverdueWorks(filters = {}) {
  const today = new Date().toISOString().split('T')[0];
  let q = supabase
    .from('works')
    .select('*, work_notes(note, created_at)')
    .lt('due_date', today)
    .neq('status', 'completed');

  if (filters.clientUuid) q = q.eq('client_uuid', filters.clientUuid);
  if (filters.staffUuids) q = q.in('staff_uuid', filters.staffUuids);

  const { data, error } = await q.order('due_date', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(mapWork);
}
