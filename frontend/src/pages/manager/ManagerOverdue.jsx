import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ManagerOverdue() {
  return <Navigate to="/manager/work" replace />;
}
