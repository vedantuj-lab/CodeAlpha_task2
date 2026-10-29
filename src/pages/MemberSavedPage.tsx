import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Edit2, Trash2, ArrowUpRight, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { savedCalculationsService } from '../services/savedCalculationsService';
import { SavedCalculation } from '../types';

export const MemberSavedPage: React.FC = () => {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedCalculation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    savedCalculationsService.getSaved(user?.id).then(setSavedItems);
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    await savedCalculationsService.deleteSaved(id, user?.id);
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartEdit = (item: SavedCalculation) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveRename = async (id: string) => {
    if (!editTitle.trim()) return;
    await savedCalculationsService.updateSavedTitle(id, editTitle.trim(), user?.id);
    setSavedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: editTitle.trim() } : item))
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
          Saved Calculations
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Bookmarked mathematical equations, formulas, and totals.
        </p>
      </div>

      <div className="space-y-3">
        {savedItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-[var(--text-secondary)] space-y-2">
            <Bookmark className="w-8 h-8 opacity-40 mx-auto" />
            <p className="text-sm font-semibold">No saved calculations found</p>
            <p className="text-xs">
              Save key equations from the calculator workspace using the bookmark button.
            </p>
          </div>
        ) : (
          savedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 overflow-hidden">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-main)] border border-[var(--accent-lime)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(item.id)}
                      className="p-1 rounded bg-[var(--accent-lime)] text-[#151715]"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded border border-[var(--border-primary)] text-[var(--text-secondary)]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[var(--accent-lime)]">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-[var(--text-secondary)] font-mono truncate">
                  {item.expression} =
                </p>
                <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                  {item.result}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => navigate('/calculator')}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] text-[var(--accent-lime)] hover:bg-[var(--accent-lime)] hover:text-[#151715] flex items-center gap-1.5 transition-colors"
                >
                  <span>Reuse in Calc</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[#C83C42] hover:bg-red-500/10 transition-colors"
                  title="Delete bookmark"
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
