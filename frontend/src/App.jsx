import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Auth pages
import Login          from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

// ── ADMIN pages ───────────────────────────────────────────────
import AdminDashboard    from './pages/admin/AdminDashboard';
import ManageManagers    from './pages/admin/ManageManagers';
import ManageStaff       from './pages/admin/ManageStaff';
import ManageClients     from './pages/admin/ManageClients';
import AttendanceAdmin   from './pages/admin/AttendanceAdmin';
import LeaveAdmin        from './pages/admin/LeaveAdmin';
import SalaryAdmin       from './pages/admin/SalaryAdmin';
import OverdueAdmin      from './pages/admin/OverdueAdmin';
import ReportsAdmin      from './pages/admin/ReportsAdmin';
import AssignTasks       from './pages/admin/AssignTasks';
import SystemSettings    from './pages/admin/SystemSettings';
import UserManagement    from './pages/admin/UserManagement';
import AuditLog          from './pages/admin/AuditLog';
import AdminNotifications from './pages/admin/AdminNotifications';

// ── MANAGER pages ─────────────────────────────────────────────
import ManagerDashboard   from './pages/manager/ManagerDashboard';
import ManagerStaff       from './pages/manager/ManagerStaff';
import ManagerClients     from './pages/manager/ManagerClients';
import ManagerAttendance  from './pages/manager/ManagerAttendance';
import ManagerLeave       from './pages/manager/ManagerLeave';
import ManagerWork        from './pages/manager/ManagerWork';
import ManagerOverdue     from './pages/manager/ManagerOverdue';
import ManagerNotifications from './pages/manager/ManagerNotifications';
import ManagerReports     from './pages/manager/ManagerReports';
import ManagerProfile     from './pages/manager/ManagerProfile';
import DailyVisits        from './pages/manager/DailyVisits';

// ── STAFF pages ───────────────────────────────────────────────
import StaffDashboard     from './pages/staff/StaffDashboard';
import Attendance         from './pages/staff/Attendance';
import StaffWork          from './pages/staff/StaffWork';
import StaffLeave         from './pages/staff/StaffLeave';
import StaffSalary        from './pages/staff/StaffSalary';
import StaffProfile       from './pages/staff/StaffProfile';
import StaffClients       from './pages/staff/StaffClients';
import StaffOverdue       from './pages/staff/StaffOverdue';
import StaffNotifications from './pages/staff/StaffNotifications';
import StaffDocuments     from './pages/staff/StaffDocuments';
import StaffReports       from './pages/staff/StaffReports';

// ── CLIENT pages ──────────────────────────────────────────────
import ClientDashboard    from './pages/client/ClientDashboard';
import ClientWork         from './pages/client/ClientWork';
import ClientOverdue      from './pages/client/ClientOverdue';
import ClientRequests     from './pages/client/ClientRequests';
import ClientNotifications from './pages/client/ClientNotifications';
import ClientDocuments    from './pages/client/ClientDocuments';
import ClientHistory      from './pages/client/ClientHistory';
import ClientMessages     from './pages/client/ClientMessages';
import ClientProfile      from './pages/client/ClientProfile';
import ClientAttendance   from './pages/client/ClientAttendance';

const AR = (roles, Component) => (
  <ProtectedRoute roles={roles}><Component /></ProtectedRoute>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public */}
            <Route path="/login"          element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/"               element={<Navigate to="/login" replace />} />

            {/* ── ADMIN ── */}
            <Route path="/admin"               element={AR(['admin'], AdminDashboard)} />
            <Route path="/admin/users"         element={AR(['admin'], UserManagement)} />
            <Route path="/admin/managers"      element={AR(['admin'], ManageManagers)} />
            <Route path="/admin/staff"         element={AR(['admin'], ManageStaff)} />
            <Route path="/admin/clients"       element={AR(['admin'], ManageClients)} />
            <Route path="/admin/attendance"    element={AR(['admin'], AttendanceAdmin)} />
            <Route path="/admin/leave"         element={AR(['admin'], LeaveAdmin)} />
            <Route path="/admin/salary"        element={AR(['admin'], SalaryAdmin)} />
            <Route path="/admin/assign-tasks"  element={AR(['admin'], AssignTasks)} />
            <Route path="/admin/visits"        element={AR(['admin'], DailyVisits)} />
            <Route path="/admin/overdue"       element={AR(['admin'], OverdueAdmin)} />
            <Route path="/admin/reports"       element={AR(['admin'], ReportsAdmin)} />
            <Route path="/admin/notifications" element={AR(['admin'], AdminNotifications)} />
            <Route path="/admin/audit-log"     element={AR(['admin'], AuditLog)} />
            <Route path="/admin/settings"      element={AR(['admin'], SystemSettings)} />

            {/* ── MANAGER ── */}
            <Route path="/manager"               element={AR(['manager'], ManagerDashboard)} />
            <Route path="/manager/staff"         element={AR(['manager'], ManagerStaff)} />
            <Route path="/manager/clients"       element={AR(['manager'], ManagerClients)} />
            <Route path="/manager/attendance"    element={AR(['manager'], ManagerAttendance)} />
            <Route path="/manager/leave"         element={AR(['manager'], ManagerLeave)} />
            <Route path="/manager/work"          element={AR(['manager'], ManagerWork)} />
            <Route path="/manager/visits"        element={AR(['manager'], DailyVisits)} />
            <Route path="/manager/overdue"       element={AR(['manager'], ManagerOverdue)} />
            <Route path="/manager/notifications" element={AR(['manager'], ManagerNotifications)} />
            <Route path="/manager/reports"       element={AR(['manager'], ManagerReports)} />
            <Route path="/manager/profile"       element={AR(['manager'], ManagerProfile)} />

            {/* ── STAFF ── */}
            <Route path="/staff"               element={AR(['staff'], StaffDashboard)} />
            <Route path="/staff/attendance"    element={AR(['staff'], Attendance)} />
            <Route path="/staff/work"          element={AR(['staff'], StaffWork)} />
            <Route path="/staff/clients"       element={AR(['staff'], StaffClients)} />
            <Route path="/staff/visits"        element={AR(['staff'], DailyVisits)} />
            <Route path="/staff/overdue"       element={AR(['staff'], StaffOverdue)} />
            <Route path="/staff/leave"         element={AR(['staff'], StaffLeave)} />
            <Route path="/staff/salary"        element={AR(['staff'], StaffSalary)} />
            <Route path="/staff/notifications" element={AR(['staff'], StaffNotifications)} />
            <Route path="/staff/documents"     element={AR(['staff'], StaffDocuments)} />
            <Route path="/staff/reports"       element={AR(['staff'], StaffReports)} />
            <Route path="/staff/profile"       element={AR(['staff'], StaffProfile)} />

            {/* ── CLIENT ── */}
            <Route path="/client"               element={AR(['client'], ClientDashboard)} />
            <Route path="/client/work"          element={AR(['client'], ClientWork)} />
            <Route path="/client/checkin"       element={AR(['client'], ClientAttendance)} />
            <Route path="/client/overdue"       element={AR(['client'], ClientOverdue)} />
            <Route path="/client/requests"      element={AR(['client'], ClientRequests)} />
            <Route path="/client/notifications" element={AR(['client'], ClientNotifications)} />
            <Route path="/client/documents"     element={AR(['client'], ClientDocuments)} />
            <Route path="/client/history"       element={AR(['client'], ClientHistory)} />
            <Route path="/client/messages"      element={AR(['client'], ClientMessages)} />
            <Route path="/client/profile"       element={AR(['client'], ClientProfile)} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
