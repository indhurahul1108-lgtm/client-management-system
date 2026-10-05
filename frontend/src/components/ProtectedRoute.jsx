import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: array of allowed roles e.g. ['admin'] or ['admin','manager']
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashMap = { admin: '/admin', manager: '/manager', staff: '/staff', client: '/client' };
    return <Navigate to={dashMap[user.role] || '/login'} replace />;
  }

  return children;
}
