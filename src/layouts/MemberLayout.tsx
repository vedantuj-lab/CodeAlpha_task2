import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { Calculator, LayoutDashboard, History, Bookmark, UserCog, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const MemberLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--accent-lime)] text-[#151715] font-bold shadow-sm'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-calc)]'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-calc)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-lime)]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-bold text-base tracking-tight">CALCORA</span>
                <span className="block text-[10px] text-[var(--text-secondary)] font-mono -mt-1">Member Space</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* User Preview */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-lime)] text-[#151715] flex items-center justify-center font-bold text-sm">
              {user?.displayName.charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.displayName || 'Member'}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <NavLink to="/member" end className={navClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/calculator" className={navClass}>
              <Calculator className="w-4 h-4" />
              <span>Calculator</span>
            </NavLink>
            <NavLink to="/member/history" className={navClass}>
              <History className="w-4 h-4" />
              <span>History</span>
            </NavLink>
            <NavLink to="/member/saved" className={navClass}>
              <Bookmark className="w-4 h-4" />
              <span>Saved Calculations</span>
            </NavLink>
            <NavLink to="/member/profile" className={navClass}>
              <UserCog className="w-4 h-4" />
              <span>Profile & Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer with Return to Public & Logout */}
        <div className="p-4 border-t border-[var(--border-primary)] space-y-1.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#C83C42] hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
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
