import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Activity, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { adminService } from '../services/adminService';
import { AdminActivityItem } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    registeredUsersCount: 0,
    savedCalculationsCount: 0,
    historyCalculationsCount: 0,
    adminActivityCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<AdminActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [s, act] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getActivityLogs(),
      ]);
      setStats(s);
      setRecentActivity(act);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-orange)] font-bold">
            <Shield className="w-4 h-4" />
            <span>ADMINISTRATION CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            Application Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Verified aggregate metrics across the Calcora platform.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="self-start sm:self-auto px-5 py-3 rounded-xl font-bold text-sm bg-[var(--accent-orange)] text-[#151715] hover:bg-[var(--accent-orange-hover)] transition-all flex items-center gap-2 shadow-md"
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </Link>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Registered Accounts</span>
            <Users className="w-4 h-4 text-[var(--accent-lime)]" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {loading ? '...' : stats.registeredUsersCount}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Active user records in database</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Saved Calculations</span>
            <span className="text-[var(--accent-orange)] font-mono text-xs">SUM</span>
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {loading ? '...' : stats.savedCalculationsCount}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Total bookmarked expressions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">History Logged</span>
            <span className="text-[var(--accent-lavender)] font-mono text-xs">COUNT</span>
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {loading ? '...' : stats.historyCalculationsCount}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Recorded calculation transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Admin Actions</span>
            <Activity className="w-4 h-4 text-[#278252]" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {loading ? '...' : stats.adminActivityCount}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Administrative security events</p>
        </div>
      </div>

      {/* Quick Navigation & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-4">
          <h2 className="font-heading font-bold text-base text-[var(--text-primary)]">
            Administrative Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/users"
              className="p-4 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-orange)] transition-colors flex flex-col justify-between"
            >
              <Users className="w-5 h-5 text-[var(--accent-orange)] mb-2" />
              <div>
                <p className="font-bold text-xs text-[var(--text-primary)]">User Management</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Inspect accounts & manage privileges</p>
              </div>
            </Link>

            <Link
              to="/admin/config"
              className="p-4 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-orange)] transition-colors flex flex-col justify-between"
            >
              <Sliders className="w-5 h-5 text-[var(--accent-orange)] mb-2" />
              <div>
                <p className="font-bold text-xs text-[var(--text-primary)]">Calculator Config</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Manage defaults and global settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent-orange)]" />
              <span>Recent Administrative Activity</span>
            </h2>
            <Link to="/admin/activity" className="text-xs text-[var(--accent-orange)] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentActivity.slice(0, 5).length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] text-center py-8">
                No administrative activity logged yet.
              </p>
            ) : (
              recentActivity.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[var(--accent-orange)]">{act.action}</span>
                    <span className="text-[var(--text-secondary)] ml-2">on {act.targetType}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
