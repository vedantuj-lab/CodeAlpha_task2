import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PasswordRecoveryPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetPassword, isSupabaseConnected } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (result.success) {
      setMessage(result.message || 'Recovery instructions have been dispatched.');
    } else {
      setErrorMessage(result.error || 'Failed to request password reset.');
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[var(--bg-main)]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Return to login"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs text-[var(--text-secondary)] font-mono">Back to Sign In</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
            Reset Password
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-600 text-xs text-emerald-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#151715] border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] space-y-1">
          <span className="font-semibold text-[var(--text-primary)] block">Authentication Mode:</span>
          <p>
            {isSupabaseConnected
              ? 'Supabase Auth SMTP is active. Recovery emails are routed via configured SMTP providers.'
              : 'Local Dev Mode is active. Simulated password recovery handles password resets locally.'}
          </p>
        </div>
      </div>
    </div>
  );
};
