import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';

export const MemberHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    historyService.getHistory(user?.id).then(setHistory);
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    await historyService.deleteItem(id, user?.id);
    setHistory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClear = async () => {
    await historyService.clearHistory(user?.id);
    setHistory([]);
    setConfirmClear(false);
  };

  const filtered = history.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.expression.toLowerCase().includes(q) || item.result.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
            Account Calculation History
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Persisted history ledger for <span className="text-[var(--accent-lime)]">{user?.email}</span>
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#C83C42] border border-[#C83C42]/30 hover:bg-red-500/10 transition-colors"
          >
            Clear Entire History
          </button>
        )}
      </div>

      {confirmClear && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-[#C83C42] flex items-center justify-between text-xs text-[var(--text-primary)]">
          <span>Are you sure you want to permanently delete all history records?</span>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-[#C83C42] text-white rounded font-bold hover:bg-red-700"
            >
              Yes, Delete All
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1 border border-[var(--border-primary)] rounded hover:bg-[var(--surface-calc)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expressions, answers, numbers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-lime)] font-mono"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-[var(--text-secondary)] space-y-2">
            <History className="w-8 h-8 opacity-40 mx-auto" />
            <p className="text-sm font-semibold">No records match your search</p>
            <p className="text-xs">Your completed equations will appear here automatically.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex items-center justify-between gap-4"
            >
              <div className="space-y-1 overflow-hidden font-mono text-xs">
                <p className="text-[var(--text-secondary)] truncate">{item.expression} =</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{item.result}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase">{item.mode}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase">{item.angleMode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate('/calculator')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] text-[var(--accent-lime)] hover:bg-[var(--accent-lime)] hover:text-[#151715] flex items-center gap-1 transition-colors"
                >
                  <span>Open</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#C83C42] hover:bg-[var(--surface-calc-secondary)] transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
