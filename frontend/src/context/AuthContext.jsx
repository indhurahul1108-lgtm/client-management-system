import React, { createContext, useContext, useState, useEffect } from 'react';

// ── Mode Switch: 'dummy' = local data, 'supabase' = real database ──
// Change this to 'supabase' once you have your Supabase URL + Key in .env
const AUTH_MODE = import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_PROJECT')
  ? 'dummy'
  : (import.meta.env.VITE_SUPABASE_URL ? 'supabase' : 'dummy');

// Dummy login (fallback until Supabase is configured)
import { loginUser as dummyLogin } from '../data/dummyData.jsx';

// Supabase login (real database)
let supabaseLogin = null;
let getUserById   = null;
if (AUTH_MODE === 'supabase') {
  import('../services/authService.js').then(mod => {
    supabaseLogin = mod.loginUser;
    getUserById   = mod.getUserById;
  });
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on startup ──────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('cms_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = async (mobile, password) => {
    if (AUTH_MODE === 'supabase' && supabaseLogin) {
      // Real Supabase login
      const { user: found, error } = await supabaseLogin(mobile, password);
      if (error || !found) return { success: false, message: error || 'Invalid credentials' };
      setUser(found);
      localStorage.setItem('cms_user', JSON.stringify(found));
      return { success: true, role: found.role };
    } else {
      // Dummy login (no Supabase yet)
      const found = dummyLogin(mobile, password);
      if (found) {
        setUser(found);
        localStorage.setItem('cms_user', JSON.stringify(found));
        return { success: true, role: found.role };
      }
      return { success: false, message: 'Invalid mobile number or password' };
    }
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  // ── Update user in context (e.g. after profile edit) ────────
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cms_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser, authMode: AUTH_MODE }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
