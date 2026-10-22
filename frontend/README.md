# ELAKIYAA — Frontend Application

This folder contains the modern React 19 + Vite + Tailwind CSS frontend application for the **ELAKIYAA Client & Workforce Management System**.

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start local Vite development server
npm start

# Build production bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

## 📂 Architecture Overview

```
frontend/src/
├── components/          # Reusable UI layouts, ProtectedRoute, ErrorBoundary
├── context/             # AuthContext (Role permissions) & LanguageContext
├── data/                # Seed data for users, clients, tasks, and shifts
├── pages/
│   ├── admin/          # Admin Portal pages (User governance, tasks, audits)
│   ├── manager/        # Manager Portal pages (Team rosters, shift oversight)
│   ├── staff/          # Staff Portal pages (Camera attendance, work logs)
│   └── client/         # Client Portal pages (Duty confirmation, requests)
├── services/            # Work & attendance business services
└── utils/               # Attendance & shift calculation utilities
```

For comprehensive project documentation, architecture diagrams, and credential listings, please refer to the root [README.md](../README.md).
