import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { DUMMY_USERS } from '../../data/dummyData.jsx';
import { useAuth } from '../../context/AuthContext';
import { Building2, Phone, MapPin, Mail } from 'lucide-react';

export default function StaffClients() {
  const { user } = useAuth();
  // Find clients assigned to this staff member
  const myClients = DUMMY_USERS.filter(
    u => u.role === 'client' && u.assignedStaffId === user?.staffId
  );

  return (
    <DashboardLayout title="My Clients">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-800">{myClients.length}</p>
            <p className="text-sm text-orange-600 font-medium">Total Clients</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-800">
              {myClients.filter(c => c.status === 'active').length}
            </p>
            <p className="text-sm text-green-600 font-medium">Active</p>
          </div>
        </div>
      </div>

      {/* Client Cards */}
      {myClients.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
          No clients assigned to you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {myClients.map(client => (
            <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-16 relative">
                <img
                  src={client.photo}
                  alt={client.name}
                  className="absolute -bottom-6 left-5 w-14 h-14 rounded-xl object-cover border-2 border-white shadow"
                />
              </div>

              {/* Card Body */}
              <div className="pt-8 px-5 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{client.name}</h3>
                    <p className="text-xs text-slate-400">{client.clientId?.toUpperCase()}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                    ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {client.status}
                  </span>
                </div>

                {/* Service */}
                <div className="bg-orange-50 rounded-xl px-3 py-2 mb-3">
                  <p className="text-xs text-orange-500 font-medium">Service</p>
                  <p className="text-sm font-semibold text-orange-800">{client.service}</p>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Phone size={13} className="text-slate-300 shrink-0" />
                    <span>{client.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <MapPin size={13} className="text-slate-300 shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
