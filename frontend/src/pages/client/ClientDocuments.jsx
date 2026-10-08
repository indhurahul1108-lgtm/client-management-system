import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getClientData } from '../../data/clientData.js';

const TYPE_FILTERS = ['All', 'Agreement', 'Invoice', 'Report', 'Certificate', 'Document'];

const TYPE_BADGE = {
  invoice: 'bg-blue-100 text-blue-700',
  agreement: 'bg-purple-100 text-purple-700',
  report: 'bg-green-100 text-green-700',
  certificate: 'bg-orange-100 text-orange-700',
  document: 'bg-slate-100 text-slate-600',
};

export default function ClientDocuments() {
  const { user } = useAuth();
  const data = getClientData(user?.clientId || 'c001');

  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = data.documents.filter((doc) => {
    const matchType = activeType === 'All' || doc.type === activeType.toLowerCase();
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleView = (doc) => {
    alert(`Document will open here\n\nFile: ${doc.name}\nSize: ${doc.size}`);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout title="My Documents">
      {/* Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-5">
        <span className="text-xl flex-shrink-0">ℹ️</span>
        <p className="text-sm text-blue-700">
          Only your documents are shown. Contact admin for additional documents.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              activeType === t
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-lg font-medium">No documents found</p>
          {search && <p className="text-sm mt-1">Try adjusting your search or filter</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Icon & Type */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-4xl">{doc.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TYPE_BADGE[doc.type] || 'bg-slate-100 text-slate-600'}`}>
                  {doc.type}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-slate-800 text-sm leading-snug">{doc.name}</h3>

              {/* Meta */}
              <div className="flex flex-col gap-1 text-xs text-slate-500">
                <span>📦 {doc.size}</span>
                <span>📅 Uploaded: {formatDate(doc.uploadedOn)}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleView(doc)}
                className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors min-h-[44px]"
              >
                View / Download
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
