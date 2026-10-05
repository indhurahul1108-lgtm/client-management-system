import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../data/dummyData.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on startup
  useEffect(() => {
    const saved = localStorage.getItem('cms_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (mobile, password) => {
    const found = loginUser(mobile, password);
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
