import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim()) {
      setErrorMessage('Please enter your full name or display handle.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(displayName, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/member');
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-stretch bg-[var(--bg-main)]">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 gap-8">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)]">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-[var(--text-primary)]">CALCORA</span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)] leading-tight">
              Create Your Free <br />
              <span className="text-[var(--accent-lime)]">Member Account.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Unlock cloud persistence for calculation history, bookmark key expressions with custom labels,
              and personalize your default angular and calculator modes.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-lime)] shrink-0" />
              <span>Multi-device synced history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-lime)] shrink-0" />
              <span>Personal saved formulas library</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-lime)] shrink-0" />
              <span>Protected by Supabase Row Level Security (RLS)</span>
            </div>
          </div>

          <div className="text-xs text-[var(--text-secondary)]">
            <span>Prefer not to register? </span>
            <Link to="/calculator" className="text-[var(--accent-lime)] hover:underline font-semibold">
              Continue as guest →
            </Link>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-1/2 max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
              Register Account
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Fill in your details below to activate your member dashboard.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-[#C83C42] text-xs text-[#C83C42] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Carter"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
                Password (min 6 characters)
              </label>
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

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#151715] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[var(--text-secondary)] pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent-lime)] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
