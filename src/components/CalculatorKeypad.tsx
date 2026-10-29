import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (op: '+' | '-' | '*' | '/' | '^') => void;
  onPercentage: () => void;
  onToggleSign: () => void;
  onCalculate: () => void;
  onClearAll: () => void;
  onDeleteLast: () => void;
  // Memory
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigit,
  onDecimal,
  onOperator,
  onPercentage,
  onToggleSign,
  onCalculate,
  onClearAll,
  onDeleteLast,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
}) => {
  const btnBase =
    'h-13 sm:h-14 rounded-xl text-base sm:text-lg font-mono font-medium transition-all active:scale-[0.97] flex items-center justify-center border select-none focus-visible:outline-none focus-visible:ring-2';
  
  // Digit buttons
  const digitBtn = `${btnBase} bg-[var(--surface-calc)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] hover:bg-[var(--surface-calc-secondary)] focus-visible:ring-[var(--accent-lime)]`;

  // Operator buttons: Warm orange accent
  const opBtn = `${btnBase} bg-[var(--surface-calc-secondary)] border-[var(--border-primary)] text-[var(--accent-orange)] hover:border-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10 font-bold focus-visible:ring-[var(--accent-orange)]`;

  // Action buttons (AC, DEL, ±, %)
  const actionBtn = `${btnBase} bg-[var(--surface-calc-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)] focus-visible:ring-[var(--accent-lime)] text-sm sm:text-base`;

  // Equals button: Electric lime accent
  const equalsBtn = `${btnBase} bg-[var(--accent-lime)] border-transparent text-[#151715] hover:bg-[var(--accent-lime-hover)] font-bold text-xl sm:text-2xl shadow-md hover:shadow-lg focus-visible:ring-[var(--accent-lime)]`;

  // Memory buttons
  const memBtn =
    'h-8 sm:h-9 rounded-lg text-xs font-mono font-semibold transition-colors border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-lime)]';

  return (
    <div className="w-full space-y-2 sm:space-y-3 pt-2">
      {/* Memory Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button onClick={onMemoryClear} className={memBtn} title="Memory Clear (MC)">
          MC
        </button>
        <button onClick={onMemoryRecall} className={memBtn} title="Memory Recall (MR)">
          MR
        </button>
        <button onClick={onMemoryAdd} className={memBtn} title="Memory Add (M+)">
          M+
        </button>
        <button onClick={onMemorySubtract} className={memBtn} title="Memory Subtract (M-)">
          M-
        </button>
        <button onClick={onMemoryStore} className={memBtn} title="Memory Store (MS)">
          MS
        </button>
      </div>

      {/* Main 4x5 Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: Clear, Delete, Sign, Divide */}
        <button
          onClick={onClearAll}
          className={`${actionBtn} text-[#C83C42] hover:text-[#C83C42] hover:border-[#C83C42] font-semibold`}
          title="All Clear (Escape)"
        >
          AC
        </button>
        <button
          onClick={onDeleteLast}
          className={actionBtn}
          title="Delete last digit (Backspace)"
          aria-label="Delete last digit"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button onClick={onToggleSign} className={actionBtn} title="Toggle Sign (±)">
          ±
        </button>
        <button onClick={() => onOperator('/')} className={opBtn} title="Division (/)">
          ÷
        </button>

        {/* Row 2: 7, 8, 9, Multiply */}
        <button onClick={() => onDigit('7')} className={digitBtn}>
          7
        </button>
        <button onClick={() => onDigit('8')} className={digitBtn}>
          8
        </button>
        <button onClick={() => onDigit('9')} className={digitBtn}>
          9
        </button>
        <button onClick={() => onOperator('*')} className={opBtn} title="Multiplication (*)">
          ×
        </button>

        {/* Row 3: 4, 5, 6, Subtract */}
        <button onClick={() => onDigit('4')} className={digitBtn}>
          4
        </button>
        <button onClick={() => onDigit('5')} className={digitBtn}>
          5
        </button>
        <button onClick={() => onDigit('6')} className={digitBtn}>
          6
        </button>
        <button onClick={() => onOperator('-')} className={opBtn} title="Subtraction (-)">
          −
        </button>

        {/* Row 4: 1, 2, 3, Add */}
        <button onClick={() => onDigit('1')} className={digitBtn}>
          1
        </button>
        <button onClick={() => onDigit('2')} className={digitBtn}>
          2
        </button>
        <button onClick={() => onDigit('3')} className={digitBtn}>
          3
        </button>
        <button onClick={() => onOperator('+')} className={opBtn} title="Addition (+)">
          +
        </button>

        {/* Row 5: Percentage, 0, Decimal, Equals */}
        <button onClick={onPercentage} className={actionBtn} title="Percentage (%)">
          %
        </button>
        <button onClick={() => onDigit('0')} className={digitBtn}>
          0
        </button>
        <button onClick={onDecimal} className={digitBtn} title="Decimal point (.)">
          .
        </button>
        <button onClick={onCalculate} className={equalsBtn} title="Calculate (Enter / =)">
          =
        </button>
      </div>
    </div>
  );
};
