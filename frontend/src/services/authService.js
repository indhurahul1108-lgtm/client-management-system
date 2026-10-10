// ============================================================
//  AUTH SERVICE — Login with mobile + password
//  Our users table stores mobile + password (not Supabase Auth)
// ============================================================
import { supabase } from '../lib/supabase';

/**
 * Login with mobile number and password.
 * Returns { user, error }
 */
export async function loginUser(mobile, password) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('mobile', mobile.trim())
    .eq('password_hash', password.trim())   // plain text for now; upgrade to bcrypt later
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return { user: null, error: 'Invalid mobile number or password.' };
  }

  // Map DB columns → camelCase for frontend compatibility
  const user = mapUser(data);
  return { user, error: null };
}

/**
 * Get user by ID (for re-auth on page refresh).
 */
export async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return mapUser(data);
}

/**
 * Change password (plain text for now).
 */
export async function changePassword(userId, currentPw, newPw) {
  // Verify current password
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .eq('password_hash', currentPw)
    .single();

  if (!data) return { error: 'Current password is incorrect' };

  const { error } = await supabase
    .from('users')
    .update({ password_hash: newPw, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { error: error?.message || null };
}

// ── Helper: map snake_case DB → camelCase UI ─────────────────
export function mapUser(u) {
  return {
    id:               u.id,
    mobile:           u.mobile,
    role:             u.role,
    name:             u.name,
    photo:            u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=128`,
    address:          u.address,
    status:           u.status,
    joinDate:         u.join_date,
    staffId:          u.staff_id,
    clientId:         u.client_id,
    managerId:        u.manager_id,
    assignedStaffId:  u.assigned_staff_id,
    assignedManagerId:u.assigned_manager_id,
    department:       u.department,
    designation:      u.designation,
    salary:           u.salary,
    service:          u.service,
  };
}
