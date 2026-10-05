import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Search, Users, Phone, Filter } from 'lucide-react';

const allStaff = DUMMY_USERS.filter(u => u.role === 'staff');
const managers = DUMMY_USERS.filter(u => u.role === 'manager');

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function ManageStaff() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = allStaff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Staff Management">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-800">{allStaff.length}</p>
            <p className="text-sm text-blue-600 font-medium">Total Staff</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-800">{allStaff.filter(s => s.status === 'active').length}</p>
            <p className="text-sm text-green-600 font-medium">Active</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-800">{allStaff.filter(s => s.status === 'inactive').length}</p>
            <p className="text-sm text-red-600 font-medium">Inactive</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Manager</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Join Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => {
                const manager = managers.find(m => m.managerId === s.managerId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-700">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.staffId?.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-300" />{s.mobile}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{manager?.name || '—'}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">₹{s.salary?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{s.joinDate}</td>
                    <td className="px-4 py-4"><Badge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No staff found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
