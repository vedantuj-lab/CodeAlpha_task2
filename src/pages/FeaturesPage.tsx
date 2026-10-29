import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  FlaskConical,
  Keyboard,
  History,
  Bookmark,
  Shield,
  Layers,
  CheckCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { runCalculationTestSuite, TestCaseResult } from '../calculator/test-engine';

export const FeaturesPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);

  const handleRunTests = () => {
    const results = runCalculationTestSuite();
    setTestResults(results);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)]">
          Capabilities & Architectural Features
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Calcora combines numerical rigor with modern frontend architecture. Below is a detailed
          breakdown of every mathematical operation, security invariant, and persistence tier implemented.
        </p>
      </div>

      {/* Feature Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Arithmetic & Precedence */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-orange)]">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Standard Precedence & Floats
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Multiplication and division take automatic precedence over addition and subtraction (<code className="text-[var(--accent-lime)]">7 + 2 × 3 = 13</code>).
            Binary floating-point noise is stripped using epsilon-tolerance normalization (<code className="text-[var(--accent-lime)]">0.1 + 0.2 = 0.3</code>).
          </p>
        </div>

        {/* Scientific & Trig */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lavender)]">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Trigonometric & Transcendentals
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Full trigonometric suite (<code className="text-[var(--accent-lavender)]">sin, cos, tan</code>) with switchable Degree/Radian mode.
            Includes inverse arcs (<code className="text-[var(--accent-lavender)]">asin, acos, atan</code>), base-10 log, natural ln, and powers (<code className="text-[var(--accent-lavender)]">xʸ</code>).
          </p>
        </div>

        {/* Domain Boundaries */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[#C83C42]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Strict Domain Error Guards
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Division by zero, negative square roots in real mode, logarithms of non-positive numbers, and undefined tangent at 90°
            throw human-readable error messages without crashing the session.
          </p>
        </div>

        {/* Keyboard Ergonomics */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)]">
            <Keyboard className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Full Keyboard Mapping
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct key bindings for numbers, arithmetic operators, Enter, Backspace, Escape, parentheses, and hotkeys
            (<code className="text-[var(--accent-lime)]">Ctrl+H</code> for History, <code className="text-[var(--accent-lime)]">Ctrl+Shift+C</code> for result copy).
          </p>
        </div>

        {/* History & Saved Calculations */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-orange)]">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Audit Trail & Bookmarks
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Guest calculations persist automatically in LocalStorage. Authenticated users synchronize records to Supabase PostgreSQL,
            with search and one-click value reuse.
          </p>
        </div>

        {/* Security & RLS */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[#278252]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Zero eval() & Database RLS
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Expressions are parsed through a custom recursive descent parser. We never pass input to <code className="text-[#C83C42]">eval()</code>.
            Database rows are locked by PostgreSQL Row Level Security.
          </p>
        </div>
      </div>

      {/* Live Engine Verification Test Suite */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-primary)]">
              Interactive Mathematical Test Suite
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Execute our verification test suite covering Section 24 arithmetic, precedence, scientific, and boundary tests directly in your browser.
            </p>
          </div>

          <button
            onClick={handleRunTests}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Calculation Tests</span>
          </button>
        </div>

        {testResults ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <span>Tests Completed: {testResults.length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#278252]">Passed: {testResults.filter((t) => t.passed).length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#C83C42]">Failed: {testResults.filter((t) => !t.passed).length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {testResults.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    t.passed
                      ? 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)]'
                      : 'bg-red-950/20 border-[#C83C42]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-[var(--text-primary)] font-semibold">{t.name}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Expr: <span className="text-[var(--accent-lime)]">{t.expression}</span>
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Expected: {t.expected} | Actual: {t.actual}
                    </p>
                  </div>
                  <div>
                    {t.passed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        PASS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                        FAIL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-secondary)]">
            Click "Run Calculation Tests" above to verify all mathematical engine specifications in real time.
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-center">
        <Link
          to="/calculator"
          className="px-6 py-3 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all"
        >
          Open Calculator Workspace
        </Link>
      </div>
    </div>
  );
};
