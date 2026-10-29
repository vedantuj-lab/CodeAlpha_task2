import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-calc)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-lime)]">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-[var(--text-primary)]">
                CALCORA
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Precision at Your Fingertips. A modern calculator platform built for students, developers,
              professionals, and everyday mathematics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--text-primary)] font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/calculator" className="hover:text-[var(--text-primary)] transition-colors">
                  Calculator Workspace
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[var(--text-primary)] transition-colors">
                  Features & Functions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[var(--text-primary)] transition-colors">
                  About Calcora
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--text-primary)] font-semibold">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[var(--text-primary)] transition-colors">
                  Create Member Account
                </Link>
              </li>
              <li>
                <Link to="/recovery" className="hover:text-[var(--text-primary)] transition-colors">
                  Password Recovery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Year and Zero-Pill Typography */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4">
          <p>© {currentYear} Calcora. Precision Numerical Engine. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Client-side Safe AST Parser</span>
            <span aria-hidden="true">·</span>
            <span>Zero eval() Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>Supabase PostgreSQL + RLS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
