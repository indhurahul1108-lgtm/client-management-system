// ============================================================
//  USERS SERVICE — CRUD for all user types
// ============================================================
import { supabase } from '../lib/supabase';
import { mapUser } from './authService';

// ── Get all users (admin only) ───────────────────────────────
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('join_date', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(mapUser);
}

// ── Get users by role ─────────────────────────────────────────
export async function getUsersByRole(role) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('name');
  if (error) { console.error(error); return []; }
  return data.map(mapUser);
}

// ── Get staff by manager ID ───────────────────────────────────
export async function getStaffByManager(managerId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'staff')
    .eq('manager_id', managerId);
  if (error) { console.error(error); return []; }
  return data.map(mapUser);
}

// ── Get clients by staff ID ───────────────────────────────────
export async function getClientsByStaff(staffId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'client')
    .eq('assigned_staff_id', staffId);
  if (error) { console.error(error); return []; }
  return data.map(mapUser);
}

// ── Add user ──────────────────────────────────────────────────
export async function addUser(form) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      mobile:       form.mobile,
      password_hash: form.password,
      role:         form.role,
      name:         form.name,
      photo:        `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random&size=128`,
      address:      form.address,
      department:   form.department,
      designation:  form.designation,
      salary:       form.salary ? Number(form.salary) : 0,
      manager_id:   form.managerId,
      staff_id:     form.staffId,
      client_id:    form.clientId,
      assigned_staff_id:   form.assignedStaffId,
      assigned_manager_id: form.assignedManagerId,
      service:      form.service,
      status:       'active',
      join_date:    new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();
  if (error) return { user: null, error: error.message };
  return { user: mapUser(data), error: null };
}

// ── Update user ───────────────────────────────────────────────
export async function updateUser(id, updates) {
  const { error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message || null };
}

// ── Toggle active/inactive ────────────────────────────────────
export async function toggleUserStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const { error } = await supabase
    .from('users')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { newStatus, error: error?.message || null };
}
