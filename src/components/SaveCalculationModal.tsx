import React, { useState, useEffect } from 'react';
import { X, BookmarkPlus, Check } from 'lucide-react';
import { AngleMode, CalculatorMode } from '../types';

interface SaveCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  expression: string;
  result: string;
  numericResult?: number;
  mode: CalculatorMode;
  angleMode: AngleMode;
  onSave: (title: string) => Promise<void>;
}

export const SaveCalculationModal: React.FC<SaveCalculationModalProps> = ({
  isOpen,
  onClose,
  expression,
  result,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSuccess(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await onSave(title.trim());
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl p-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-calc-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-[var(--accent-lime)]">
          <BookmarkPlus className="w-5 h-5" />
          <h3 id="save-calc-title" className="font-heading font-bold text-lg text-[var(--text-primary)]">
            Save Calculation
          </h3>
        </div>

        {/* Calculation Preview */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] mb-5">
          <p className="text-xs text-[var(--text-secondary)] font-mono">{expression || '0'} =</p>
          <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1">{result || '0'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Calculation Title / Note
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Budget Total, Hypotenuse..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <span>Save to Workspace</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
