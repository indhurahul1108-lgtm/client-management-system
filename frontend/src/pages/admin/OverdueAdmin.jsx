import React from 'react';
import { Navigate } from 'react-router-dom';

export default function OverdueAdmin() {
  return <Navigate to="/admin/assign-tasks" replace />;
}
