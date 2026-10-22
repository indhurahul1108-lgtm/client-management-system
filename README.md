# 🌟 ELAKIYAA — Client & Workforce Management System
Official Workforce & Client Management Platform

---

## 📌 Executive Summary

**ELAKIYAA Client & Workforce Management System** is a production-ready enterprise solution engineered for manpower staffing, client service tracking, and distributed shift management. Originally customized for oil & gas retail networks (Indian Oil, Bharat Petroleum, Hindustan Petroleum, Shell, Nayara) and enterprise service providers, it unifies **Admin governance, Manager supervision, Staff operational reporting, and Client transparency** into a seamless, high-performance web platform.

- **Live Website Link**: https://client-management-system-iota.vercel.app
- **GitHub Repository Link**: https://github.com/indhurahul1108-lgtm/client-management-system

---

## 🏢 Business Problem & Solution

| Traditional Industry Challenges | ELAKIYAA Enterprise Solution |
| :--- | :--- |
| **Buddy Punching & False Attendance** | **Biometric Camera & Geo-Stamped Attendance** — Real-time front-camera capture with embedded GPS coordinates, address, and tamper-proof timestamp overlay on HTML5 canvas. |
| **Disconnected Task Allocations** | **Multi-Entity Task Engine** — Single or bulk task assignments across multiple staff members and multiple client stations simultaneously. |
| **Lack of Client Visibility** | **Dedicated Client Portal** — Real-time tracking of assigned staff, shift logs, official document downloads, and service request tracking. |
| **Slow Payroll & Leave Processing** | **Automated Payroll & Leave System** — Leave approval chains with automatic status propagation and detailed salary slip generation (basic, allowances, deductions, net). |
| **Zero Audit Accountability** | **Immutable Audit Trail** — Automatic timestamped logging of every critical administrative action, attendance correction, and role update. |

---

## 👥 Role-Based Portals & Feature Matrix

The platform incorporates comprehensive Role-Based Access Control (RBAC) across 4 distinct user tiers:

### 1. 👑 Admin Portal (/admin)
- **Executive Dashboard**: Key workforce KPIs, active client counts, daily attendance ratios, and system health.
- **User Governance**: Search, filter, inspect profiles, and activate/deactivate accounts across all 4 tiers without accidental data loss.
- **Staff & Manager Roster**: Detailed directory with direct telephonic contact and branch assignments.
- **Client Management**: Comprehensive management of fuel stations and corporate clients with assigned supervisor tracking.
- **Advanced Task Allocation**:
  - Multi-select multiple staff members simultaneously.
  - Multi-select multiple client branches simultaneously.
  - Priority flags (High, Medium, Low), target deadlines, and progress logs.
- **Attendance Control & Audit**: View all daily punch-ins with photo thumbnails, late calculations, and administrative correction modal with reason recording.
- **Salary Management**: Comprehensive salary register with earnings breakdown and exportable records.
- **Audit Logging**: Immutable security trail recording logins, task creations, leave actions, and system modifications with IP and timestamps.

### 2. 👔 Manager Portal (/manager)
- **Supervisory Dashboard**: Today's active team presence, pending leave requests, and active operational tasks.
- **Team Roster**: Inspection of staff members assigned to the manager with attendance history and task workload.
- **Client Station Monitoring**: Review client satisfaction, assigned personnel, and shift coverage.
- **Leave Authorization**: Two-way workflow to approve/reject subordinate leave applications and apply for personal managerial leave.
- **Work Orchestration**: Assign tasks directly to team members and monitor real-time completion percentages.

### 3. 👷 Staff Portal (/staff)
- **Camera-Verified Punch In/Out**:
  - Live webcam feed capture.
  - HTML5 canvas stamping of staff name, timestamp, shift status, and geolocation coordinates.
  - Automatic calculation of late minutes based on company shift policies (10:00 AM start with 10-minute grace period).
- **Task Execution**: Real-time progress slider (0% to 100%), status updates (Pending -> In Progress -> Completed), and activity note logging.
- **Leave Requests**: Submit sick, casual, or annual leave with automated manager notification.
- **Digital Payslips**: Instant access to monthly salary vouchers and deduction summaries.
- **Document Locker**: View appointment letters, policies, and certificates.

### 4. 🏢 Client Portal (/client)
- **Station Overview**: Quick view of deployed security/operations personnel, shift schedules, and pending service tickets.
- **Duty Confirmation**: Direct confirmation action for client managers acknowledging deployed staff on site.
- **Direct Communication**: One-click direct calling to assigned supervisor and staff members.
- **Service & Material Requests**: Submit service requests, uniform/equipment requests, or complaints with SLA tracking.
- **Document Library**: Access signed service level agreements (SLAs), monthly invoices, and compliance certificates.
- **Work History**: Filterable history of all completed and ongoing operations with print/export functionality.

---

## 🔑 Quick Demo Credentials (1-Click Login Ready)

The live login page features 1-Click Quick Fill Pills for immediate evaluator testing:

| Role | Demo User | Mobile Number | Password | Landing Route |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Arjun Sharma (System Admin) | `9000000001` | `admin123` | `/admin` |
| **Manager** | Priya Nair (Operations Manager) | `9000000002` | `manager123` | `/manager` |
| **Staff** | Anitha Devi (Senior Attendant) | `9000000004` | `staff123` | `/staff` |
| **Client** | Indian Oil Petrol Bunk (IOCL) | `9100000001` | `client123` | `/client` |

---

## 🛠️ Technology Stack & Engineering Architecture

- **Frontend Framework**: React 19 (Pure Functional Components + Hooks)
- **Bundler & Build Tool**: Vite 8 (Optimized tree-shaken production bundles)
- **Styling Architecture**: Tailwind CSS 3.4 (Mobile-responsive layout system)
- **Icons**: Lucide React
- **Cloud Backend & Database**: Supabase (PostgreSQL Database Schema & Storage)
- **Deployment**: Vercel Cloud Platform (Continuous Deployment via GitHub main branch)
