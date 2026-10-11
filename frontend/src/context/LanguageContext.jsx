import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    // Top & Common
    appTitle: 'ELAKIYAA Petrol Bunk Staffing',
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
    attendance: 'Attendance / Punch',
    myBunkDuty: 'My Bunk Duty',
    myBunks: 'Assigned Petrol Bunks',
    leave: 'Leave Request',
    salary: 'Salary & Payout',
    reports: 'Reports',
    bunkClients: 'Petrol Bunks',
    bunkStaff: 'Bunk Staff / Crew',
    managers: 'Managers',
    settings: 'Settings',

    // Petrol Bunk Specific
    bunkName: 'Petrol Bunk Name',
    deployedStaff: 'Deployed Staff on Duty',
    leadOperator: 'Lead Fuel Operator',
    cashier: 'Cashier & POS',
    nightAttendant: 'Night Attendant',
    monthlyBill: 'Monthly Manpower Bill',
    multiBunksAssigned: 'Assigned to Multiple Petrol Bunks',
    easyTip: 'Simple 1-Click Operation for Fuel Crew',
  },
  ta: {
    // Top & Common
    appTitle: 'இலக்கியா பெட்ரோல் பங்க் ஆட்கள் மேலாண்மை',
    welcome: 'வணக்கம்',
    logout: 'வெளியேறு (Logout)',
    language: 'மொழி',
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    status: 'நிலைமை',
    actions: 'செயல்கள்',
    close: 'மூடுக',
    active: 'செயலில் உள்ளது',
    inactive: 'முடக்கப்பட்டது',
    today: 'இன்று',
    time: 'நேரம்',
    date: 'தேதி',
    location: 'இடம் (GPS)',
    search: 'தேடுக...',
    all: 'அனைத்தும்',

    // Attendance
    punchIn: 'பணி தொடங்கு (Punch In - போட்டோ & GPS)',
    punchOut: 'பணி முடி (Punch Out)',
    punchSuccess: 'வருகை பதிவு செய்யப்பட்டது!',
    takeSelfie: 'கேமரா செல்ஃபி எடுக்கவும்',
    capturePhoto: 'போட்டோ எடு',
    gpsVerified: 'பங்க் இடம் & நேரம் சரிபார்க்கப்பட்டது',
    selectShift: 'ஷிப்ட் தேர்வு செய்க',
    morningShift: 'ஷிப்ட் 1: காலை (06:00 AM - 02:00 PM)',
    eveningShift: 'ஷிப்ட் 2: மாலை (02:00 PM - 10:00 PM)',
    nightShift: 'ஷிப்ட் 3: இரவு (10:00 PM - 06:00 AM)',
    shiftTiming: '3 ஷிப்ட்கள் 24 மணி நேர பங்க் பாதுகாப்பு',
    attendanceHistory: 'முந்தைய வருகை விபரம்',
    present: 'வந்தவர் (Present)',
    absent: 'வரவில்லை (Absent)',
    late: 'தாமதம் (Late)',

    // Navigation / Menus
    dashboard: 'முகப்பு (Dashboard)',
    attendance: 'வருகைப் பதிவு (Punch In/Out)',
    myBunkDuty: 'இன்றைய பங்க் வேலை',
    myBunks: 'ஒதுக்கப்பட்ட பெட்ரோல் பங்குகள்',
    leave: 'விடுப்பு விண்ணப்பம் (Leave)',
    salary: 'சம்பளம் & தொகை (Salary)',
    reports: 'அறிக்கைகள் (Reports)',
    bunkClients: 'பெட்ரோல் பங்குகள்',
    bunkStaff: 'பங்க் பணியாளர்கள்',
    managers: 'மேலாளர்கள் (Managers)',
    settings: 'அமைப்புகள்',

    // Petrol Bunk Specific
    bunkName: 'பெட்ரோல் பங்க் பெயர்',
    deployedStaff: 'பணியில் உள்ள ஆட்கள்',
    leadOperator: 'முக்கிய ஆப்பரேட்டர்',
    cashier: 'கேஷியர் / பில் போடுபவர்',
    nightAttendant: 'இரவு நேர பணியாளர்',
    monthlyBill: 'மாதாந்திர ஆட்கள் பில்',
    multiBunksAssigned: 'ஒன்றுக்கும் மேற்பட்ட பங்குகளுக்கு வேலை',
    easyTip: 'பங்க் தொழிலாளர்களுக்கு எளிய 1-கிளிக் முறை',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('cms_lang') || 'en';
  });

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    localStorage.setItem('cms_lang', next);
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('cms_lang', newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, changeLanguage, t }}>
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
      t: (key) => key,
    };
  }
  return context;
}
