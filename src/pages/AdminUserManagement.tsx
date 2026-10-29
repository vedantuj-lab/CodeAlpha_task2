import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, ShieldAlert, Check, UserCheck } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { UserProfile, UserRole } from '../types';

export const AdminUserManagement: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'member' | 'admin'>('all');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await adminService.getUsers();
    setUsers(list);
    setLoading(false);
  };

  const handleToggleRole = async (targetUser: UserProfile) => {
    if (targetUser.id === currentAdmin?.id) {
      alert("Security Constraint: You cannot revoke your own administrator privileges.");
      return;
    }

    const nextRole: UserRole = targetUser.role === 'admin' ? 'member' : 'admin';
    const confirmed = window.confirm(
      `Are you sure you want to change the security role of ${targetUser.displayName} to "${nextRole}"?`
    );
    if (!confirmed) return;

    const ok = await adminService.updateUserRole(targetUser.id, nextRole, currentAdmin?.id || 'admin');
    if (ok) {
      setStatusMessage(`Updated ${targetUser.displayName}'s role to ${nextRole}`);
      setTimeout(() => setStatusMessage(null), 3000);
      loadUsers();
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
            User Account Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Inspect verified user profiles and assign administrative security roles.
          </p>
        </div>

        <span className="text-xs font-mono text-[var(--accent-orange)] px-2.5 py-1 rounded-md bg-[var(--surface-calc)] border border-[var(--border-subtle)]">
          {users.length} Total Users Registered
        </span>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-600 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)]"
          />
        </div>

        {/* Role Segmented Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-xs w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              roleFilter === 'all'
                ? 'bg-[var(--accent-orange)] text-[#151715] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('member')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              roleFilter === 'member'
                ? 'bg-[var(--accent-orange)] text-[#151715] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Members ({users.filter((u) => u.role === 'member').length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              roleFilter === 'admin'
                ? 'bg-[var(--accent-orange)] text-[#151715] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Admins ({users.filter((u) => u.role === 'admin').length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-primary)] bg-[var(--surface-calc-secondary)] text-[var(--text-secondary)] font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--text-secondary)]">
                    Loading users list...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--text-secondary)]">
                    No user accounts match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs text-[var(--accent-lime)]">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{u.displayName}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-[var(--accent-orange)] text-[#151715]'
                            : 'bg-[var(--surface-calc-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id === currentAdmin?.id ? (
                        <span className="text-[11px] text-[var(--text-secondary)] italic">Current User</span>
                      ) : (
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                            u.role === 'admin'
                              ? 'border-[#C83C42]/40 text-[#C83C42] hover:bg-red-500/10'
                              : 'border-[var(--accent-orange)] text-[var(--accent-orange)] hover:bg-[var(--accent-orange)] hover:text-[#151715]'
                          }`}
                        >
                          {u.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
