import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck, Cpu, Code2, HeartHandshake, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface-calc)] border border-[var(--border-subtle)] text-xs text-[var(--accent-lime)] font-mono">
          <span>Engineered for Precision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[var(--text-primary)]">
          About Calcora
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          Calcora was engineered from the ground up to solve the persistent issues found in standard web calculators:
          floating-point inaccuracies, unpredictable operator chaining, and reliance on hazardous JavaScript evaluation.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Deterministic AST Parser
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Rather than relying on <code className="text-[#C83C42]">eval()</code> or loose regex evaluation, Calcora tokenizes
            inputs into a formal Abstract Syntax Tree. This guarantees strict mathematical operator precedence
            (<code className="text-[var(--accent-lime)]">×</code> and <code className="text-[var(--accent-lime)]">÷</code> before <code className="text-[var(--accent-lime)]">+</code> and <code className="text-[var(--accent-lime)]">−</code>), nested parenthesis resolution, and safe function execution.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-orange)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Offline First & Zero Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Calculations are completed 100% locally on your machine. You never have to wait on an API request or
            maintain an internet connection to solve complex scientific equations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lavender)]">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Supabase PostgreSQL with RLS
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            For users who choose to create an account, data persistence is backed by Supabase with Row Level Security (RLS)
            enforced at the database layer. No user can view or alter another member's calculation records.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[#278252]">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Accessible & Keyboard Native
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Designed for real human interaction. Every button has high contrast, clear focus rings, screen-reader labels,
            and 1:1 parity with standard physical keyboard entry.
          </p>
        </div>
      </div>

      {/* Ready Banner */}
      <div className="p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-heading font-bold text-xl text-[var(--text-primary)]">
            Ready to compute with precision?
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Jump directly into the workspace or create a free member account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/calculator"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
