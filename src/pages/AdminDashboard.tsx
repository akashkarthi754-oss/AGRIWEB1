import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  Sprout,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  RefreshCw,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res?.success) {
        setStats(res.stats);
        setUsers(res.users);
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      const res = await api.admin.updateUserStatus(userId, !currentStatus);
      if (res?.success) {
        setMessage(res.message);
        // Refresh local list
        setUsers((prev) =>
          prev.map((u) => (u.id === userId || u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        if (stats) {
          setStats({
            ...stats,
            activeUsers: currentStatus ? stats.activeUsers - 1 : stats.activeUsers + 1,
            inactiveUsers: currentStatus ? stats.inactiveUsers + 1 : stats.inactiveUsers - 1,
          });
        }
      }
    } catch (err: any) {
      setMessage('Failed to update user status: ' + (err.message || 'Error'));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm) ||
      u.organization?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === 'all'
        ? true
        : selectedRole === 'transporter'
        ? u.role === 'transporter' || u.role === 'logistics'
        : u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/50 text-blue-200 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            User Management & Governance
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Welcome back, {user?.name}. Monitor real registered accounts, permissions, and roles.
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-black text-stone-900">{stats?.totalUsers ?? '...'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Farmers</span>
            <Sprout className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-800">{stats?.farmersCount ?? '...'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold">Buyers</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-800">{stats?.buyersCount ?? '...'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-semibold">Transporters</span>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-800">{stats?.transportersCount ?? '...'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold">Active</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats?.activeUsers ?? '...'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-semibold">Disabled</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-600">{stats?.inactiveUsers ?? '...'}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'farmer', 'buyer', 'transporter', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                selectedRole === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Registered Users ({filteredUsers.length})
          </h2>
          <span className="text-xs text-stone-500">Live MongoDB documents</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-medium">Loading user directory from MongoDB...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-stone-300" />
            <p className="text-sm font-medium">No users found matching your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => {
                  const uId = u.id || u._id;
                  const isActive = u.isActive !== false;
                  return (
                    <tr key={uId} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{u.name}</div>
                        <div className="text-[11px] text-stone-500">{u.organization || 'No organization'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                            u.role === 'farmer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'buyer'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'transporter' || u.role === 'logistics'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role === 'logistics' ? 'transporter' : u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{u.email}</div>
                        <div className="text-[11px] text-stone-500">{u.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 text-xs">
                        {u.location?.district || u.location?.state ? (
                          <span>
                            {u.location?.village ? `${u.location.village}, ` : ''}
                            {u.location?.district}, {u.location?.state}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Not specified</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            isActive ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Disabled</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(uId, isActive)}
                            disabled={actionLoading === uId}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              isActive
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {actionLoading === uId ? (
                              'Updating...'
                            ) : isActive ? (
                              'Deactivate'
                            ) : (
                              'Activate'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
