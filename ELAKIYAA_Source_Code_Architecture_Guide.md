# 💻 ELAKIYAA — Complete Source Code & Architecture Guide

```
Repository       : https://github.com/indhurahul1108-lgtm/client-management-system
Frontend Engine  : React 19.3.0 + Vite 8.3.2 + Tailwind CSS 3.4
Database Layer   : Supabase Cloud PostgreSQL (supabase/schema.sql)
Live Deployment  : https://client-management-system-iota.vercel.app
```

---

## 📂 1. Complete Project Directory Map

```
Client_Management_System/
│
├── frontend/                          # React 19 Frontend Application
│   ├── public/                        # Static assets (images, icons)
│   ├── src/
│   │   ├── components/                # Reusable Layout & Navigation Components
│   │   │   ├── DashboardLayout.jsx    # Universal Portal Layout (Header, Sidebar, User Profile)
│   │   │   ├── ProtectedRoute.jsx     # Zero-Trust RBAC Route Guard
│   │   │   ├── ErrorBoundary.jsx      # Global React Error Catching Component
│   │   │   ├── PhoneCallModal.jsx     # Direct Telephonic Calling Modal
│   │   │   └── ...
│   │   │
│   │   ├── context/                   # Global React Context State
│   │   │   ├── AuthContext.jsx        # User Session, Role Permissions & Auth Engine
│   │   │   └── LanguageContext.jsx    # Multi-language Context
│   │   │
│   │   ├── data/                      # Seed Data & Offline Synchronizer
│   │   │   ├── dummyData.jsx          # 23 Seed Users, Attendance, Tasks, Salaries, Leaves
│   │   │   └── clientData.js          # Client-specific work, requests & documents
│   │   │
│   │   ├── lib/                       # Third-Party Integrations
│   │   │   └── supabase.js            # Supabase Cloud PostgreSQL Client Instance
│   │   │
│   │   ├── pages/                     # 30+ Role-Based Portal Pages
│   │   │   │
│   │   │   ├── Login.jsx              # Universal Auth Gateway with 1-Click Demo Pills
│   │   │   ├── ForgotPassword.jsx     # Password Recovery Page
│   │   │   │
│   │   │   ├── admin/                 # 👑 ADMIN PORTAL (13 Pages)
│   │   │   │   ├── AdminDashboard.jsx     # Executive KPIs & Operational Overview
│   │   │   │   ├── UserManagement.jsx     # User CRUD & Status Toggles (Active/Inactive)
│   │   │   │   ├── ManageManagers.jsx     # Area Managers Directory & Assignment
│   │   │   │   ├── ManageStaff.jsx        # Field Staff Directory with Direct Calling
│   │   │   │   ├── ManageClients.jsx      # Petrol Bunk Client Establishments
│   │   │   │   ├── AssignTasks.jsx        # Multi-Staff & Multi-Client Task Delegation Engine
│   │   │   │   ├── AttendanceAdmin.jsx    # Attendance Register & Audit-Logged Edit Modal
│   │   │   │   ├── LeaveAdmin.jsx         # Workforce Leave Authorization Workflow
│   │   │   │   ├── SalaryAdmin.jsx        # Payroll Processing & Payslip Register
│   │   │   │   ├── ReportsAdmin.jsx       # Consolidated Operational Reports
│   │   │   │   ├── AdminNotifications.jsx # System & Workforce Broadcast Announcements
│   │   │   │   ├── AuditLog.jsx           # Immutable Security & Audit Trail
│   │   │   │   └── SystemSettings.jsx     # Shift Hours & Grace Period Configuration
│   │   │   │
│   │   │   ├── manager/               # 👔 MANAGER PORTAL (10 Pages)
│   │   │   │   ├── ManagerDashboard.jsx   # Team Shift Overview & Pending Approvals
│   │   │   │   ├── ManagerStaff.jsx       # Assigned Staff Workload & Roster
│   │   │   │   ├── ManagerClients.jsx     # Client Bunk Inspection Records
│   │   │   │   ├── ManagerAttendance.jsx  # Team Attendance Review & Late Verification
│   │   │   │   ├── ManagerLeave.jsx       # Staff Leave Approval & Personal Leave Application
│   │   │   │   ├── ManagerWork.jsx        # Task Assignment & Real-Time Progress Monitoring
│   │   │   │   ├── ManagerNotifications.jsx # Operational Shift Alerts
│   │   │   │   ├── ManagerReports.jsx     # Team Attendance & Duty Reports
│   │   │   │   ├── ManagerProfile.jsx     # Manager Profile & Password Settings
│   │   │   │   └── DailyVisits.jsx        # Bunk Inspection Logs
│   │   │   │
│   │   │   ├── staff/                 # 👷 STAFF PORTAL (10 Pages)
│   │   │   │   ├── StaffDashboard.jsx     # Daily Attendance Status & Assigned Work Cards
│   │   │   │   ├── Attendance.jsx         # Live Camera Punch In/Out with Canvas Geostamp
│   │   │   │   ├── StaffWork.jsx          # Task Progress Slider (0-100%) & Status Updates
│   │   │   │   ├── StaffLeave.jsx         # Leave Application with Manager Forwarding
│   │   │   │   ├── StaffSalary.jsx        # Digital Monthly Payslips with Deductions
│   │   │   │   ├── StaffClients.jsx       # Assigned Bunk Contact Information
│   │   │   │   ├── StaffNotifications.jsx # Work Reminders & Approval Notices
│   │   │   │   ├── StaffDocuments.jsx     # Employment Letters & ID Proofs
│   │   │   │   ├── StaffReports.jsx       # Personal Attendance History
│   │   │   │   └── StaffProfile.jsx       # Personal Profile & Shift Information
│   │   │   │
│   │   │   └── client/                # 🏢 CLIENT PORTAL (8 Pages)
│   │   │       ├── ClientDashboard.jsx    # Bunk Shift Overview & "Confirm Duty" Action
│   │   │       ├── ClientWork.jsx         # Station Operational Tasks & Real-Time Status
│   │   │       ├── ClientRequests.jsx     # Extra Staff / Service Ticketing Form
│   │   │       ├── ClientNotifications.jsx# Station Shift & Deployment Notifications
│   │   │       ├── ClientDocuments.jsx    # SLA Agreements & Monthly GST Invoices
│   │   │       ├── ClientHistory.jsx      # Filterable Operations History with Print Export
│   │   │       ├── ClientMessages.jsx     # Direct Chat with Assigned Staff & Supervisor
│   │   │       └── ClientProfile.jsx      # Bunk Profile & Contact Details
│   │   │
│   │   ├── services/                  # Business Logic Layer
│   │   │   └── workService.js         # Task Queries, Priority Sorting, Status Lifecycle
│   │   │
│   │   ├── utils/                     # Utility Functions
│   │   │   ├── attendanceUtils.js     # Shift Time Comparisons & Late Minute Computation
│   │   │   └── printUtils.js          # Formatted PDF/Print Generators
│   │   │
│   │   ├── App.jsx                    # Central Route Registry with Role Guards
│   │   └── index.jsx                  # React DOM Entrypoint
│   │
│   ├── package.json                   # Dependencies & Build Scripts
│   ├── tailwind.config.js             # Custom Brand Color Palettes
│   └── vite.config.js                 # Vite Bundler Configuration
│
├── supabase/                          # Cloud Backend & Database Layer
│   ├── schema.sql                     # Complete PostgreSQL Relational Database Schema
│   ├── seed.sql                       # Seed Data for 23 Accounts, Bunks & Shift Records
│   └── SETUP_GUIDE.md                 # Supabase Cloud Setup Instructions
│
├── DOCUMENTATION.md                   # Full Technical Specification (Markdown)
├── README.md                          # GitHub Homepage Guide (Markdown)
├── ELAKIYAA_Complete_Project_Document.html # Printable Standalone Document (HTML/PDF)
└── vercel.json                        # Vercel Deployment Configuration
```

---

## 🔑 2. Core Technical Implementations Explained

### A. Role-Based Route Protection (`ProtectedRoute.jsx`)
```jsx
// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  // If user is not logged in, bounce to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not authorized for this route, bounce to their home portal
  if (roles && !roles.includes(user.role)) {
    const roleRedirect = {
      admin: '/admin',
      manager: '/manager',
      staff: '/staff',
      client: '/client'
    };
    return <Navigate to={roleRedirect[user.role] || '/login'} replace />;
  }

  return children;
}
```

---

### B. Biometric Camera & Canvas Geostamping (`Attendance.jsx`)
```javascript
// Captures video frame from webcam and stamps GPS coordinates & timestamp
const capturePhotoWithCanvas = (videoElement, canvasElement, userInfo, locationInfo) => {
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = 640;
  canvasElement.height = 480;

  // 1. Draw live webcam frame
  ctx.drawImage(videoElement, 0, 0, 640, 480);

  // 2. Draw tamper-proof gradient banner overlay at bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 390, 640, 90);

  // 3. Stamp Employee Name, Live Timestamp, and Geolocation
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`STAFF: ${userInfo.name} (${userInfo.staffId})`, 20, 418);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '13px monospace';
  ctx.fillText(`TIME: ${new Date().toLocaleTimeString()} | DATE: ${new Date().toLocaleDateString()}`, 20, 442);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText(`GPS: ${locationInfo.lat}, ${locationInfo.lng} — ${locationInfo.city}`, 20, 464);

  // 4. Export sealed base64 image
  return canvasElement.toDataURL('image/jpeg', 0.85);
};
```

---

### C. Multi-Staff & Multi-Client Task Delegation (`AssignTasks.jsx`)
```javascript
// Handles simultaneous assignment to multiple field staff and multiple petrol bunks
const handleAssignTask = (formData) => {
  const newTask = {
    id: `TASK-${Date.now()}`,
    task: formData.task,
    staffIds: formData.selectedStaffIds,     // e.g. ['s001', 's002', 's005']
    clientIds: formData.selectedClientIds,   // e.g. ['c001', 'c002']
    dueDate: formData.dueDate,
    priority: formData.priority,             // 'high' | 'medium' | 'low'
    status: 'pending',
    remarks: formData.remarks,
    assignedOn: new Date().toISOString().split('T')[0]
  };

  setTasks(prev => [newTask, ...prev]);
};
```

---

### D. PostgreSQL Cloud Schema (`supabase/schema.sql`)
```sql
-- Relational Task Mapping Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relational Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(100),
    action VARCHAR(50),
    module VARCHAR(50),
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
