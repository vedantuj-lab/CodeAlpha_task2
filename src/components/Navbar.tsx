import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Calculator, Menu, X, Shield, User, LogOut, ChevronDown, CheckCircle2, CloudOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, isSupabaseConnected } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-[var(--accent-lime)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-primary)] bg-[var(--bg-main)]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--surface-calc)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-lime)] group-hover:border-[var(--accent-lime)] transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg tracking-tight text-[var(--text-primary)]">
              CALCORA
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] -mt-1 font-mono">
              Precision Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/calculator" className={navLinkClass}>
            Calculator
          </NavLink>
          <NavLink to="/features" className={navLinkClass}>
            Features
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/member" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1.5 text-[var(--accent-orange)]">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Action Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Connection Mode Indicator */}
          <div
            title={
              isSupabaseConnected
                ? 'Connected to Supabase PostgreSQL & Auth'
                : 'Local Development Mode: Stored locally in browser'
            }
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
          >
            {isSupabaseConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#278252]" />
                <span className="text-[11px] font-mono">Cloud Sync</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-[#B7791F]" />
                <span className="text-[11px] font-mono">Local Mode</span>
              </>
            )}
          </div>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--surface-calc)] hover:border-[var(--accent-lime)] transition-colors text-sm"
              >
                <div className="w-6 h-6 rounded-md bg-[var(--accent-lime)] text-[#151715] flex items-center justify-center font-bold text-xs">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[var(--text-primary)] font-medium max-w-[120px] truncate">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-primary)] bg-[var(--surface-calc)] shadow-xl py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-[var(--border-primary)]">
                    <p className="text-xs text-[var(--text-secondary)]">Signed in as</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-lime)]">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    to="/member"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  >
                    <User className="w-4 h-4" />
                    Member Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-[var(--accent-orange)] hover:bg-[var(--bg-secondary)]"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Control
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-sm text-[#C83C42] hover:bg-[var(--bg-secondary)]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/calculator"
                className="px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-colors shadow-sm"
              >
                Open Calculator
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-primary)] bg-[var(--bg-main)] px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <span>Database Mode:</span>
            <span className="font-mono text-[var(--text-primary)]">
              {isSupabaseConnected ? 'Cloud Sync (Supabase)' : 'Local Storage Mode'}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm text-[var(--text-primary)]"
            >
              Home
            </Link>
            <Link
              to="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-semibold text-[var(--accent-lime)]"
            >
              Calculator Workspace
            </Link>
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm text-[var(--text-primary)]"
            >
              Features
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm text-[var(--text-primary)]"
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                to="/member"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm text-[var(--text-primary)]"
              >
                Member Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm text-[var(--accent-orange)]"
              >
                Admin Control
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-primary)] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-center py-2 text-sm font-medium rounded-lg border border-[var(--border-primary)] text-[#C83C42]"
              >
                Sign Out ({user?.displayName})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-[var(--accent-lime)] text-[#151715]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
