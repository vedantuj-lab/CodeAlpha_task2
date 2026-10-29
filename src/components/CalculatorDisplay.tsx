import React, { useState, useEffect } from 'react';
import { Copy, Check, BookmarkPlus, AlertCircle } from 'lucide-react';
import { AngleMode, CalculatorMode } from '../types';

interface CalculatorDisplayProps {
  expression: string;
  currentInput: string;
  previousExpression: string;
  error: string | null;
  memory: number;
  angleMode: AngleMode;
  mode: CalculatorMode;
  onToggleAngleMode: () => void;
  onSaveClick: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  currentInput,
  previousExpression,
  error,
  memory,
  angleMode,
  mode,
  onToggleAngleMode,
  onSaveClick,
}) => {
  const [copied, setCopied] = useState(false);

  // Copy result action
  const handleCopy = async () => {
    const textToCopy = error ? '' : currentInput.replace(/,/g, '');
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  // Listen to keyboard shortcut event
  useEffect(() => {
    const onCopyShortcut = () => handleCopy();
    window.addEventListener('calcora:copy-result', onCopyShortcut);
    return () => window.removeEventListener('calcora:copy-result', onCopyShortcut);
  }, [currentInput, error]);

  // Dynamic text size based on character count
  const getDisplaySizeClass = (text: string) => {
    const len = text.length;
    if (len > 18) return 'text-xl sm:text-2xl';
    if (len > 13) return 'text-2xl sm:text-3xl';
    if (len > 8) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  const displayText = error || currentInput;

  return (
    <div className="w-full rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] shadow-inner relative overflow-hidden transition-all">
      {/* Top Status & Controls Row */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          {/* Deg/Rad Toggle */}
          <button
            onClick={onToggleAngleMode}
            type="button"
            className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider transition-colors bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)] text-[var(--text-primary)]"
            title="Click to toggle Degree / Radian mode"
          >
            {angleMode.toUpperCase()}
          </button>

          {/* Memory Active Indicator */}
          {memory !== 0 && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-lime-soft)] text-[#151715]"
              title={`Memory Stored: ${memory}`}
            >
              M
            </span>
          )}

          {/* Mode Tag */}
          <span className="text-[11px] uppercase tracking-wide opacity-75">
            {mode === 'scientific' ? 'Scientific' : 'Standard'}
          </span>
        </div>

        {/* Quick actions (Copy, Save) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSaveClick}
            type="button"
            aria-label="Save this calculation"
            title="Save calculation to bookmarked records"
            className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy result"
            title="Copy current result (Ctrl+Shift+C)"
            className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors relative"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#278252]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Middle: Secondary Expression / Formula */}
      <div className="pt-2 text-right text-xs sm:text-sm font-mono text-[var(--text-secondary)] tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none min-h-[22px]">
        {previousExpression || expression || ' '}
      </div>

      {/* Bottom: Main Displayed Input or Result */}
      <div className="flex items-baseline justify-end gap-2 text-right overflow-x-auto scrollbar-none pt-1">
        {error && <AlertCircle className="w-5 h-5 text-[#C83C42] shrink-0 self-center" />}
        <span
          className={`font-mono font-bold tracking-tight select-all transition-all duration-100 ${
            error ? 'text-[#C83C42] text-lg sm:text-xl font-sans' : 'text-[var(--text-primary)]'
          } ${!error ? getDisplaySizeClass(displayText) : ''}`}
        >
          {displayText}
        </span>
      </div>
    </div>
  );
};
