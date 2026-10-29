import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, History, Bookmark, ArrowUpRight, Sparkles, Clock, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { historyService } from '../services/historyService';
import { savedCalculationsService } from '../services/savedCalculationsService';
import { HistoryItem, SavedCalculation } from '../types';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [hist, saved] = await Promise.all([
        historyService.getHistory(user?.id),
        savedCalculationsService.getSaved(user?.id),
      ]);
      setHistoryItems(hist);
      setSavedItems(saved);
      setIsLoading(false);
    }
    loadData();
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-lime)]">
            <span>MEMBER DASHBOARD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            Welcome back, {user?.displayName || 'Member'}!
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Your personal calculations workspace is ready.
          </p>
        </div>

        <Link
          to="/calculator"
          className="self-start sm:self-auto px-5 py-3 rounded-xl font-bold text-sm bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-all flex items-center gap-2 shadow-md"
        >
          <Calculator className="w-4 h-4" />
          <span>Launch Calculator</span>
        </Link>
      </div>

      {/* Real Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">History Total</span>
            <History className="w-4 h-4 text-[var(--accent-orange)]" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {isLoading ? '...' : historyItems.length}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Recorded equations in your ledger</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-[var(--accent-lime)]" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)]">
            {isLoading ? '...' : savedItems.length}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">Custom-labeled formulas</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-wider">Account Role</span>
            <Settings className="w-4 h-4 text-[var(--accent-lavender)]" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-[var(--text-primary)] uppercase font-mono text-[var(--accent-lime)]">
            {user?.role || 'member'}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">{user?.email}</p>
        </div>
      </div>

      {/* Quick Launch & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calculations */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-orange)]" />
              <h2 className="font-heading font-bold text-base text-[var(--text-primary)]">
                Recent Calculations
              </h2>
            </div>
            <Link to="/member/history" className="text-xs text-[var(--accent-lime)] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {historyItems.slice(0, 5).length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] text-center py-6">
                No recent calculations yet. Use the calculator to start computing.
              </p>
            ) : (
              historyItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-[var(--text-secondary)] truncate max-w-[180px]">
                    {item.expression} =
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--text-primary)]">{item.result}</span>
                    <Link
                      to="/calculator"
                      className="text-[var(--accent-lime)] hover:underline"
                      title="Open in calculator"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Bookmarks Preview */}
        <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[var(--accent-lime)]" />
              <h2 className="font-heading font-bold text-base text-[var(--text-primary)]">
                Saved Calculations
              </h2>
            </div>
            <Link to="/member/saved" className="text-xs text-[var(--accent-lime)] hover:underline font-semibold flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {savedItems.slice(0, 5).length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] text-center py-6">
                No saved calculations yet. Bookmark your key expressions from the calculator.
              </p>
            ) : (
              savedItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono"
                >
                  <div className="truncate max-w-[200px]">
                    <p className="font-semibold text-[var(--accent-lime)] truncate">{item.title}</p>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">{item.expression}</p>
                  </div>
                  <span className="font-bold text-[var(--text-primary)]">{item.result}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
