import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';


// Auth pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageManagers from './pages/admin/ManageManagers';
import ManageStaff from './pages/admin/ManageStaff';
import ManageClients from './pages/admin/ManageClients';
import AttendanceAdmin from './pages/admin/AttendanceAdmin';
import LeaveAdmin from './pages/admin/LeaveAdmin';
import SalaryAdmin from './pages/admin/SalaryAdmin';
import OverdueAdmin from './pages/admin/OverdueAdmin';
import ReportsAdmin from './pages/admin/ReportsAdmin';
import AssignTasks from './pages/admin/AssignTasks';
import SystemSettings from './pages/admin/SystemSettings';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard';
import Attendance from './pages/staff/Attendance';
import StaffLeave from './pages/staff/StaffLeave';
import StaffSalary from './pages/staff/StaffSalary';
import StaffProfile from './pages/staff/StaffProfile';
import StaffClients from './pages/staff/StaffClients';
import StaffOverdue from './pages/staff/StaffOverdue';


// Client pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientWork from './pages/client/ClientWork';
import ClientProfile from './pages/client/ClientProfile';


export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

          {/* Public routes */}
          <Route path="/login"           element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/"                element={<Navigate to="/login" replace />} />

          {/* ── ADMIN ──────────────────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/managers" element={
            <ProtectedRoute roles={['admin']}><ManageManagers /></ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute roles={['admin']}><ManageStaff /></ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute roles={['admin']}><ManageClients /></ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute roles={['admin']}><AttendanceAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/leave" element={
            <ProtectedRoute roles={['admin']}><LeaveAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/salary" element={
            <ProtectedRoute roles={['admin']}><SalaryAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/overdue" element={
            <ProtectedRoute roles={['admin']}><OverdueAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['admin']}><ReportsAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/assign-tasks" element={
            <ProtectedRoute roles={['admin']}><AssignTasks /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute roles={['admin']}><SystemSettings /></ProtectedRoute>
          } />

          {/* ── MANAGER ────────────────────────────────── */}
          <Route path="/manager" element={
            <ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>
          } />
          <Route path="/manager/staff" element={
            <ProtectedRoute roles={['manager']}><ManageStaff /></ProtectedRoute>
          } />
          <Route path="/manager/clients" element={
            <ProtectedRoute roles={['manager']}><ManageClients /></ProtectedRoute>
          } />
          <Route path="/manager/attendance" element={
            <ProtectedRoute roles={['manager']}><AttendanceAdmin /></ProtectedRoute>
          } />
          <Route path="/manager/leave" element={
            <ProtectedRoute roles={['manager']}><LeaveAdmin /></ProtectedRoute>
          } />
          <Route path="/manager/overdue" element={
            <ProtectedRoute roles={['manager']}><OverdueAdmin /></ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute roles={['manager']}><ReportsAdmin /></ProtectedRoute>
          } />

          {/* ── STAFF ──────────────────────────────────── */}
          <Route path="/staff" element={
            <ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>
          } />
          <Route path="/staff/attendance" element={
            <ProtectedRoute roles={['staff']}><Attendance /></ProtectedRoute>
          } />
          <Route path="/staff/leave" element={
            <ProtectedRoute roles={['staff']}><StaffLeave /></ProtectedRoute>
          } />
          <Route path="/staff/salary" element={
            <ProtectedRoute roles={['staff']}><StaffSalary /></ProtectedRoute>
          } />
          <Route path="/staff/profile" element={
            <ProtectedRoute roles={['staff']}><StaffProfile /></ProtectedRoute>
          } />
          <Route path="/staff/clients" element={
            <ProtectedRoute roles={['staff']}><StaffClients /></ProtectedRoute>
          } />
          <Route path="/staff/overdue" element={
            <ProtectedRoute roles={['staff']}><StaffOverdue /></ProtectedRoute>
          } />

          {/* ── CLIENT ─────────────────────────────────── */}
          <Route path="/client" element={
            <ProtectedRoute roles={['client']}><ClientDashboard /></ProtectedRoute>
          } />
          <Route path="/client/work" element={
            <ProtectedRoute roles={['client']}><ClientWork /></ProtectedRoute>
          } />
          <Route path="/client/profile" element={
            <ProtectedRoute roles={['client']}><ClientProfile /></ProtectedRoute>
          } />


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
