import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { Search, Building2, Phone, MapPin } from 'lucide-react';

const clients = DUMMY_USERS.filter(u => u.role === 'client');
const staffList = DUMMY_USERS.filter(u => u.role === 'staff');

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
      ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function ManageClients() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Client Management">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: clients.length,                                    color: 'orange', icon: Building2 },
          { label: 'Active',        value: clients.filter(c => c.status === 'active').length,  color: 'green',  icon: Building2 },
          { label: 'Inactive',      value: clients.filter(c => c.status === 'inactive').length,color: 'red',    icon: Building2 },
        ].map(({ label, value, color, icon: Icon }) => {
          const cols = { orange: 'bg-orange-50 border-orange-100 text-orange-800 bg-orange-600', green: 'bg-green-50 border-green-100 text-green-800 bg-green-600', red: 'bg-red-50 border-red-100 text-red-800 bg-red-500' };
          return (
            <div key={label} className={`${cols[color].split(' ').slice(0,3).join(' ')} border rounded-2xl p-5 flex items-center gap-4`}>
              <div className={`w-11 h-11 ${cols[color].split(' ')[3]} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${cols[color].split(' ')[2]}`}>{value}</p>
                <p className="text-sm font-medium opacity-70">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assigned Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => {
                const staff = staffList.find(s => s.staffId === c.assignedStaffId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-700">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.clientId?.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-300" />{c.mobile}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg">{c.service}</span>
                    </td>
                    <td className="px-4 py-4">
                      {staff ? (
                        <div className="flex items-center gap-2">
                          <img src={staff.photo} alt={staff.name} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="text-xs text-slate-600 font-medium">{staff.name}</span>
                        </div>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs max-w-[150px] truncate">{c.address}</td>
                    <td className="px-4 py-4"><Badge status={c.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No clients found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
