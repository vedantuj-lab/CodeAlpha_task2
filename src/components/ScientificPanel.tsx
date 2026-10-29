import React, { useState } from 'react';
import { AngleMode } from '../types';

interface ScientificPanelProps {
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onFunction: (fn: string) => void;
  onConstant: (constant: 'pi' | 'e') => void;
  onParenthesis: (paren: '(' | ')') => void;
  onOperator: (op: '^') => void;
}

export const ScientificPanel: React.FC<ScientificPanelProps> = ({
  angleMode,
  onToggleAngleMode,
  onFunction,
  onConstant,
  onParenthesis,
  onOperator,
}) => {
  const [isSecondPage, setIsSecondPage] = useState(false);

  const btnBase =
    'h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all active:scale-[0.98] flex items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lavender)]';
  
  const sciBtn =
    `${btnBase} bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-lavender)] hover:text-[var(--accent-lavender)]`;

  return (
    <div className="w-full pt-3 pb-1 border-t border-[var(--border-subtle)]">
      {/* Function Toggle bar */}
      <div className="flex items-center justify-between pb-2.5 px-0.5 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSecondPage(!isSecondPage)}
            type="button"
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
              isSecondPage
                ? 'bg-[var(--accent-lavender)] text-[#151715] border-[var(--accent-lavender)] font-bold'
                : 'bg-[var(--surface-calc-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
          >
            2nd {isSecondPage ? 'Active' : ''}
          </button>
          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
            Mode: <strong className="text-[var(--accent-lavender)]">{angleMode.toUpperCase()}</strong>
          </span>
        </div>

        <button
          onClick={onToggleAngleMode}
          type="button"
          className="text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-lavender)] text-[var(--text-primary)]"
        >
          Switch to {angleMode === 'deg' ? 'RAD' : 'DEG'}
        </button>
      </div>

      {/* Grid of Scientific Buttons (5 columns) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Trig or Inv Trig */}
        {!isSecondPage ? (
          <>
            <button onClick={() => onFunction('sin')} className={sciBtn} title="Sine">
              sin
            </button>
            <button onClick={() => onFunction('cos')} className={sciBtn} title="Cosine">
              cos
            </button>
            <button onClick={() => onFunction('tan')} className={sciBtn} title="Tangent">
              tan
            </button>
            <button onClick={() => onFunction('log')} className={sciBtn} title="Base-10 Logarithm">
              log₁₀
            </button>
            <button onClick={() => onFunction('ln')} className={sciBtn} title="Natural Logarithm (ln)">
              ln
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onFunction('asin')} className={sciBtn} title="Arcsine">
              sin⁻¹
            </button>
            <button onClick={() => onFunction('acos')} className={sciBtn} title="Arccosine">
              cos⁻¹
            </button>
            <button onClick={() => onFunction('atan')} className={sciBtn} title="Arctangent">
              tan⁻¹
            </button>
            <button onClick={() => onFunction('log')} className={sciBtn} title="Base-10 Logarithm">
              log₁₀
            </button>
            <button onClick={() => onFunction('ln')} className={sciBtn} title="Natural Logarithm">
              ln
            </button>
          </>
        )}

        {/* Row 2: Powers & Roots */}
        <button onClick={() => onFunction('x2')} className={sciBtn} title="Square (x²)">
          x²
        </button>
        <button onClick={() => onFunction('x3')} className={sciBtn} title="Cube (x³)">
          x³
        </button>
        <button onClick={() => onOperator('^')} className={sciBtn} title="Exponentiation (xʸ)">
          xʸ
        </button>
        <button onClick={() => onFunction('sqrt')} className={sciBtn} title="Square Root (√x)">
          √x
        </button>
        <button onClick={() => onFunction('cbrt')} className={sciBtn} title="Cube Root (∛x)">
          ∛x
        </button>

        {/* Row 3: Math Tools & Constants */}
        <button onClick={() => onFunction('recip')} className={sciBtn} title="Reciprocal (1/x)">
          1/x
        </button>
        <button onClick={() => onFunction('abs')} className={sciBtn} title="Absolute Value (|x|)">
          |x|
        </button>
        <button onClick={() => onFunction('fact')} className={sciBtn} title="Factorial (x!)">
          x!
        </button>
        <button onClick={() => onConstant('pi')} className={sciBtn} title="Pi Constant (π ≈ 3.14159)">
          π
        </button>
        <button onClick={() => onConstant('e')} className={sciBtn} title="Euler's Constant (e ≈ 2.71828)">
          e
        </button>

        {/* Row 4: Parentheses */}
        <button onClick={() => onParenthesis('(')} className={sciBtn} title="Open Parenthesis">
          (
        </button>
        <button onClick={() => onParenthesis(')')} className={sciBtn} title="Close Parenthesis">
          )
        </button>
        <button
          onClick={() => onFunction('asin')}
          className={`${sciBtn} col-span-3 text-xs`}
          title="Inverse Trigonometric Arc"
        >
          {angleMode === 'deg' ? 'Trig Angular: Degrees (°)' : 'Trig Angular: Radians (rad)'}
        </button>
      </div>
    </div>
  );
};
