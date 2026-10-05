import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS, DUMMY_MANAGERS } from '../../data/dummyData.jsx';
import { Search, Users, Phone, MapPin, Calendar } from 'lucide-react';

const managers = DUMMY_USERS.filter(u => u.role === 'manager');

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function ManageManagers() {
  const [search, setSearch] = useState('');

  const filtered = managers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  );

  return (
    <DashboardLayout title="Managers">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-800">{managers.length}</p>
            <p className="text-sm text-purple-600 font-medium">Total Managers</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-800">{managers.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-green-600 font-medium">Active</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-800">10</p>
            <p className="text-sm text-blue-600 font-medium">Total Staff Managed</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search managers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Manager</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Join Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(m => {
                const meta = DUMMY_MANAGERS.find(dm => dm.userId === m.id);
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-slate-700">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 flex items-center gap-1.5 mt-3">
                      <Phone size={13} className="text-slate-300" /> {m.mobile}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs max-w-xs truncate">{m.address}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{m.joinDate}</td>
                    <td className="px-4 py-4">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {meta?.staffCount || 0} Staff
                      </span>
                    </td>
                    <td className="px-4 py-4"><Badge status={m.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No managers found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
