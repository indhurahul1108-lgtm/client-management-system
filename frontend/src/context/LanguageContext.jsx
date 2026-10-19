import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    // Top & Common
    appTitle: 'Client Management System',
    welcome: 'Welcome',
    logout: 'Logout',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    status: 'Status',
    actions: 'Actions',
    close: 'Close',
    active: 'Active',
    inactive: 'Inactive',
    today: 'Today',
    time: 'Time',
    date: 'Date',
    location: 'Location',
    search: 'Search...',
    all: 'All',

    // Attendance
    punchIn: 'Punch In (Selfie & GPS)',
    punchOut: 'Punch Out',
    punchSuccess: 'Punch Recorded Successfully!',
    takeSelfie: 'Take Camera Selfie',
    capturePhoto: 'Snap Photo',
    gpsVerified: 'GPS & Time Verified',
    selectShift: 'Select Shift',
    morningShift: 'Shift 1: Morning (06:00 AM - 02:00 PM)',
    eveningShift: 'Shift 2: Evening (02:00 PM - 10:00 PM)',
    nightShift: 'Shift 3: Night (10:00 PM - 06:00 AM)',
    shiftTiming: '3 Shifts 24/7 Bunk Coverage',
    attendanceHistory: 'Attendance History',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',

    // Navigation / Menus
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    myBunkDuty: 'My Duty Schedule',
    myBunks: 'Assigned Clients',
    leave: 'Leave Requests',
    salary: 'Salary & Payout',
    reports: 'Reports',
    bunkClients: 'Clients',
    bunkStaff: 'Staff',
    managers: 'Managers',
    settings: 'Settings',

    // Station Specific
    bunkName: 'Petrol Bunk Name',
    deployedStaff: 'Deployed Staff on Duty',
    leadOperator: 'Lead Fuel Operator',
    cashier: 'Cashier & POS',
    nightAttendant: 'Night Attendant',
    monthlyBill: 'Monthly Manpower Bill',
    multiBunksAssigned: 'Assigned to Multiple Petrol Bunks',
    easyTip: 'Simple 1-Click Operation',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {};
  const changeLanguage = () => {};

  const t = (key) => {
    return TRANSLATIONS.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang: 'en', toggleLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      toggleLanguage: () => {},
      changeLanguage: () => {},
      t: (key) => TRANSLATIONS.en?.[key] || key,
    };
  }
  return context;
}
