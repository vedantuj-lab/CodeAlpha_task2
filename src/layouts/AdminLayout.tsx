import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Shield, Users, Activity, Sliders, ChevronLeft, AlertOctagon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-[var(--text-secondary)]">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[var(--surface-calc)] border border-[#C83C42]/40 text-center space-y-4">
          <AlertOctagon className="w-12 h-12 text-[#C83C42] mx-auto" />
          <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">
            Access Restricted
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            The Administration Dashboard requires an authorized <code className="text-[var(--accent-orange)]">admin</code> role in the database.
            Your current account role is: <strong className="uppercase font-mono text-[var(--text-primary)]">{user?.role || 'guest'}</strong>.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/member"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-calc-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-lime)]"
            >
              Go to Member Dashboard
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-lime)] text-[#151715]"
            >
              Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--accent-orange)] text-[#151715] font-bold shadow-sm'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-calc)]'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange)] text-[#151715] flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-bold text-base tracking-tight text-[var(--text-primary)]">
                  CALCORA
                </span>
                <span className="block text-[10px] text-[var(--accent-orange)] font-mono -mt-1 font-semibold uppercase">
                  Admin Console
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Current Admin user */}
          <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] text-xs">
            <p className="text-[var(--text-secondary)]">Authenticated Admin:</p>
            <p className="font-semibold text-[var(--text-primary)] truncate">{user?.displayName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <NavLink to="/admin" end className={navClass}>
              <Shield className="w-4 h-4" />
              <span>Admin Overview</span>
            </NavLink>
            <NavLink to="/admin/users" className={navClass}>
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </NavLink>
            <NavLink to="/admin/activity" className={navClass}>
              <Activity className="w-4 h-4" />
              <span>Application Activity</span>
            </NavLink>
            <NavLink to="/admin/config" className={navClass}>
              <Sliders className="w-4 h-4" />
              <span>Calculator Config</span>
            </NavLink>
          </nav>
        </div>

        {/* Back Link */}
        <div className="p-4 border-t border-[var(--border-primary)]">
          <Link
            to="/member"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Member Workspace</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
