import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="no-print">
          <Navbar title={title} />
        </div>
        <main className="flex-1 p-6 overflow-auto">
          {/* Official Letterhead Header for Print */}
          <div className="hidden print:flex items-center justify-between pb-4 mb-5 border-b-2 border-slate-900">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="ELAKIYAA" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-black text-slate-900">ELAKIYAA - JOBS MADE SIMPLE</h1>
                <p className="text-xs text-slate-600 font-semibold">{title} · Official Management Records</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-700 font-medium">
              <p>Printed on: <strong>{new Date().toLocaleDateString('en-IN')}</strong></p>
              <p>Time: <strong>{new Date().toLocaleTimeString('en-IN')}</strong></p>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
