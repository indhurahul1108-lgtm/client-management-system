import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as dummyLogin, DUMMY_USERS } from '../data/dummyData.jsx';
import { supabase } from '../lib/supabase';
import { mapUser } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore saved session on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cms_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved user', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler with Supabase + Dummy fallback
  const login = async (mobile, password) => {
    const cleanMobile = (mobile || '').trim();
    const cleanPassword = (password || '').trim();

    // 1. First attempt Supabase if available
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('mobile', cleanMobile)
          .eq('password_hash', cleanPassword)
          .eq('status', 'active')
          .maybeSingle();

        if (data && !error) {
          const mapped = mapUser(data);
          setUser(mapped);
          localStorage.setItem('cms_user', JSON.stringify(mapped));
          return { success: true, role: mapped.role };
        }
      } catch (err) {
        console.warn('Supabase login check failed, falling back to local credentials:', err);
      }
    }

    // 2. Dummy Login fallback (always works)
    const found = dummyLogin(cleanMobile, cleanPassword);
    if (found) {
      setUser(found);
      localStorage.setItem('cms_user', JSON.stringify(found));
      return { success: true, role: found.role };
    }

    return { success: false, message: 'Invalid mobile number or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cms_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
