import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Search, Trash2, ArrowUpRight, Clock, BookmarkPlus, X } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onReuseResult: (result: string) => void;
  onReuseExpression?: (expression: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onSaveItem?: (item: HistoryItem) => void;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onReuseResult,
  onReuseExpression,
  onDeleteItem,
  onClearAll,
  onSaveItem,
  onClose,
  isMobileDrawer = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.expression.toLowerCase().includes(q) || item.result.toLowerCase().includes(q);
  });

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface-calc)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--accent-lime)]" />
          <h3 className="font-heading font-semibold text-sm text-[var(--text-primary)]">
            Calculation History
          </h3>
          <span className="text-xs text-[var(--text-secondary)] font-mono">
            ({filteredHistory.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="text-xs text-[var(--text-secondary)] hover:text-[#C83C42] px-2 py-1 rounded transition-colors"
              title="Clear all history"
            >
              Clear
            </button>
          )}
          {isMobileDrawer && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Close History"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal / Bar */}
      {confirmClearOpen && (
        <div className="p-3 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-primary)]">Clear all records?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClearAll();
                setConfirmClearOpen(false);
              }}
              className="px-2.5 py-1 rounded bg-[#C83C42] text-white font-medium hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmClearOpen(false)}
              className="px-2.5 py-1 rounded border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      {history.length > 4 && (
        <div className="p-2.5 border-b border-[var(--border-subtle)]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations or answers..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)] font-mono"
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[220px]">
        {filteredHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-secondary)]">
            <Clock className="w-8 h-8 opacity-30 mb-2" />
            <p className="text-xs font-medium">No calculation history yet</p>
            <p className="text-[11px] opacity-75 mt-0.5">
              Completed expressions will be preserved here automatically.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-primary)] transition-all flex flex-col gap-1.5"
            >
              {/* Formula & Timestamp */}
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
                <span className="truncate max-w-[180px]">{item.expression} =</span>
                <span className="text-[10px] opacity-70">{formatTimestamp(item.timestamp)}</span>
              </div>

              {/* Main Result */}
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-[var(--text-primary)] tracking-tight">
                  {item.result}
                </span>

                {/* Hover Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {onSaveItem && (
                    <button
                      onClick={() => onSaveItem(item)}
                      title="Save calculation"
                      className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-lime)] hover:bg-[var(--bg-secondary)]"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onReuseResult(item.result)}
                    title="Reuse result in calculator"
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--accent-lime)] hover:bg-[var(--accent-lime)] hover:text-[#151715] transition-colors"
                  >
                    <span>Reuse</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1 rounded text-[var(--text-secondary)] hover:text-[#C83C42] hover:bg-[var(--bg-secondary)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
