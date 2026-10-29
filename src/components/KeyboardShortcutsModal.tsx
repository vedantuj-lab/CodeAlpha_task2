import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Enter numbers' },
    { key: '+  −  *  /', desc: 'Basic arithmetic operators' },
    { key: '.', desc: 'Decimal point' },
    { key: 'Enter or =', desc: 'Execute calculation' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape', desc: 'All Clear (AC)' },
    { key: '%', desc: 'Percentage calculation' },
    { key: '(  )', desc: 'Parentheses (Scientific / Expressions)' },
    { key: '^', desc: 'Exponentiation (Power)' },
    { key: 'Ctrl + H / ⌘H', desc: 'Toggle calculation history panel' },
    { key: 'Ctrl + Shift + C', desc: 'Copy current result to clipboard' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl p-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close shortcuts dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-[var(--accent-lime)]">
          <Keyboard className="w-5 h-5" />
          <h3 id="shortcuts-modal-title" className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Keyboard Shortcuts
          </h3>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-4">
          All standard calculator operations can be navigated seamlessly using your physical keyboard.
        </p>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] text-xs"
            >
              <span className="text-[var(--text-secondary)]">{item.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border-primary)] font-mono font-semibold text-[var(--accent-lime)] text-[11px]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-calc-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-lime)]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
