import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  FlaskConical,
  Keyboard,
  History,
  Bookmark,
  SunMoon,
  Smartphone,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCalculator } from '../hooks/useCalculator';
import { CalculatorDisplay } from '../components/CalculatorDisplay';
import { CalculatorKeypad } from '../components/CalculatorKeypad';
import { ScientificPanel } from '../components/ScientificPanel';

export const LandingPage: React.FC = () => {
  const [sciPreview, setSciPreview] = useState(false);

  // Live real mini-calculator demo in hero
  const calc = useCalculator({
    initialMode: 'standard',
  });

  const features = [
    {
      icon: Calculator,
      title: 'Basic Arithmetic',
      desc: 'High-precision addition, subtraction, multiplication, division, sign reversal, and chained percentage calculations without floating-point artifacts.',
    },
    {
      icon: FlaskConical,
      title: 'Scientific Calculations',
      desc: 'Complete trigonometry, inverse arc functions, powers, roots, natural log, log₁₀, and factorials with selectable Degree/Radian angular modes.',
    },
    {
      icon: Keyboard,
      title: 'Keyboard Support',
      desc: 'Every key is mapped to your physical keyboard: numeric numpad, operators, Enter for result, Backspace to delete, and Escape to clear.',
    },
    {
      icon: History,
      title: 'Calculation History',
      desc: 'Instant audit trail of your calculations with one-click result reuse, granular search, and delete controls stored locally and in the cloud.',
    },
    {
      icon: Bookmark,
      title: 'Saved Calculations',
      desc: 'Bookmark important formulas and totals with custom title notes (e.g., "Monthly Budget", "Ohm’s Law") for quick future retrieval.',
    },
    {
      icon: SunMoon,
      title: 'Light & Dark Themes',
      desc: 'Designed with deep charcoal surfaces, electric lime highlights, and high-contrast light mode with immediate zero-flicker toggle.',
    },
    {
      icon: Smartphone,
      title: 'Responsive Interface',
      desc: 'Adapts seamlessly across mobile, tablet, laptop, and 1440px desktop viewports with tactile touch targets and zero horizontal overflow.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Personal Accounts',
      desc: 'Optional Supabase Auth and PostgreSQL storage protected by Row Level Security (RLS) to synchronize your workspace across devices.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Open Calcora',
      desc: 'Launch the calculator instantly in your browser. No signup or account is required for full arithmetic and scientific tools.',
    },
    {
      step: '02',
      title: 'Enter an Expression',
      desc: 'Type using your physical keyboard or tap the responsive keypad. Chain operations with automatic mathematical operator precedence.',
    },
    {
      step: '03',
      title: 'Calculate the Result',
      desc: 'Press Enter or equals to compute. Our custom AST parser guarantees precision with zero dangerous JavaScript eval() usage.',
    },
    {
      step: '04',
      title: 'Review or Save',
      desc: 'Copy results with one click, reuse values in subsequent operations, or bookmark with a title to your personal saved library.',
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[var(--border-primary)] bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-calc)] text-xs text-[var(--accent-lime)] font-mono">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse" />
                <span>Zero eval() · Deterministic Safe Arithmetic</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                Precision at Your Fingertips.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Calculate smarter with a beautifully designed calculator built for everyday mathematics,
                scientific exploration, and efficient problem-solving.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <span>Open Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm border border-[var(--border-primary)] bg-[var(--surface-calc)] text-[var(--text-primary)] hover:border-[var(--accent-lime)] transition-colors"
                >
                  Explore Features
                </a>
              </div>

              {/* Zero-pill highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[var(--text-secondary)] font-mono">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                  Instant Guest Access
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                  100% Offline Capable
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                  Supabase RLS Persistence
                </span>
              </div>
            </div>

            {/* Right Column: Live Interactive Calculator Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-5 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl space-y-3.5 relative">
                {/* Header with live badge */}
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="font-heading font-bold text-xs tracking-wider text-[var(--text-primary)] uppercase">
                    Interactive Live Demo
                  </span>
                  <button
                    onClick={() => setSciPreview(!sciPreview)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--accent-lavender)] hover:border-[var(--accent-lavender)]"
                  >
                    {sciPreview ? 'Hide Sci' : 'Show Sci'}
                  </button>
                </div>

                <CalculatorDisplay
                  expression={calc.expression}
                  currentInput={calc.currentInput}
                  previousExpression={calc.previousExpression}
                  error={calc.error}
                  memory={calc.memory}
                  angleMode={calc.angleMode}
                  mode={calc.mode}
                  onToggleAngleMode={() =>
                    calc.setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
                  }
                  onSaveClick={() => {}}
                />

                {sciPreview && (
                  <ScientificPanel
                    angleMode={calc.angleMode}
                    onToggleAngleMode={() =>
                      calc.setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
                    }
                    onFunction={calc.inputFunction}
                    onConstant={calc.inputConstant}
                    onParenthesis={calc.inputParenthesis}
                    onOperator={calc.inputOperator}
                  />
                )}

                <CalculatorKeypad
                  onDigit={calc.inputDigit}
                  onDecimal={calc.inputDecimal}
                  onOperator={calc.inputOperator}
                  onPercentage={calc.inputPercentage}
                  onToggleSign={calc.toggleSign}
                  onCalculate={calc.calculate}
                  onClearAll={calc.clearAll}
                  onDeleteLast={calc.deleteLast}
                  onMemoryClear={calc.memoryClear}
                  onMemoryRecall={calc.memoryRecall}
                  onMemoryAdd={calc.memoryAdd}
                  onMemorySubtract={calc.memorySubtract}
                  onMemoryStore={calc.memoryStore}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[var(--bg-main)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--text-primary)]">
              Engineered for Exacting Minds
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Every detail of Calcora was built from first principles — combining safe mathematical tokenization,
              delightful keyboard ergonomics, and cloud-ready data persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] hover:border-[var(--accent-lime)] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--text-primary)]">
              How Calcora Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              A frictionless workflow designed to keep you in your problem-solving flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="space-y-3 relative">
                <span className="font-mono text-3xl font-extrabold text-[var(--accent-lime)] opacity-60">
                  {st.step}
                </span>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                  {st.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[var(--bg-main)] border-b border-[var(--border-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
              About Calcora
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-mono">
              The precision platform for students, developers, and everyday thinkers.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Most web calculators fall into two extremes: either toy prototypes that break with basic order of operations,
            or bloated applications crammed with advertising and sluggish user interfaces. Calcora was created to provide
            a high-performance, strictly verified alternative.
          </p>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Our dedicated TypeScript parser constructs an Abstract Syntax Tree (AST) directly in the browser.
            Expressions like <code className="text-[var(--accent-lime)]">7 + 2 × 3</code> correctly evaluate to 13
            with standard mathematical precedence, and floating-point errors such as <code className="text-[var(--accent-lime)]">0.1 + 0.2</code>
            are cleaned without arbitrary truncation. The core calculator functions completely offline with zero server dependencies,
            while members can sync calculations to a private Supabase PostgreSQL database protected by Row Level Security.
          </p>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-t from-[var(--surface-calc)] to-[var(--bg-main)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[var(--text-primary)]">
            Your Next Calculation Starts Here.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            Experience mathematical precision and unmatched speed with Calcora. No installation or registration needed.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/calculator"
              className="px-8 py-4 rounded-xl font-bold text-base bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all shadow-xl active:scale-[0.98]"
            >
              Calculate Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
