import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, Eye, EyeOff, Lock, Mail, ArrowRight, Shield, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleDemoSignIn = async (role: 'member' | 'admin') => {
    setIsSubmitting(true);
    await demoLogin(role);
    setIsSubmitting(false);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/member');
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-stretch bg-[var(--bg-main)]">
      {/* Split Screen Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 gap-8">
        {/* Left Panel: Brand & Illustration */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)]">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-[var(--text-primary)]">CALCORA</span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)] leading-tight">
              Your Calculations, <br />
              <span className="text-[var(--accent-lime)]">Your Personal Workspace.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Sign in to synchronize your calculation history, manage bookmarked formulas, and configure
              personalized calculation preferences across sessions.
            </p>
          </div>

          {/* Minimalist interactive preview showcase */}
          <div className="p-4 rounded-2xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-mono">
              <span>Cloud Sync State</span>
              <span className="text-[var(--accent-lime)] font-semibold">
                {isSupabaseConnected ? 'PostgreSQL Active' : 'Local Storage Mode'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--text-secondary)]">12000 + 4500 + 1800</span>
              <span className="text-[var(--accent-lime)] font-bold">18,300</span>
            </div>
          </div>

          <div className="text-xs text-[var(--text-secondary)]">
            <span>Don't need cloud synchronization? </span>
            <Link to="/calculator" className="text-[var(--accent-lime)] hover:underline font-semibold">
              Use Calculator without account →
            </Link>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
              Welcome Back
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Enter your credentials to access your member dashboard.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-[#C83C42] text-xs text-[#C83C42] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Password
                </label>
                <Link
                  to="/recovery"
                  className="text-xs text-[var(--accent-orange)] hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#151715] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <p className="text-[11px] text-center text-[var(--text-secondary)] font-mono">
              Testing & Evaluation Quick Access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('member')}
                className="py-1.5 px-2 rounded-lg bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)] text-xs text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                <span>Member Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                className="py-1.5 px-2 rounded-lg bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-orange)] text-xs text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[var(--text-secondary)]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[var(--accent-lime)] font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
