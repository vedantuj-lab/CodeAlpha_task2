import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCalculator } from '../hooks/useCalculator';
import { CalculatorDisplay } from '../components/CalculatorDisplay';
import { CalculatorKeypad } from '../components/CalculatorKeypad';
import { ScientificPanel } from '../components/ScientificPanel';
import { HistoryPanel } from '../components/HistoryPanel';
import { SaveCalculationModal } from '../components/SaveCalculationModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { HistoryItem, SavedCalculation } from '../types';
import { historyService } from '../services/historyService';
import { savedCalculationsService } from '../services/savedCalculationsService';
import { FlaskConical, Keyboard, Clock, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [activeSideTab, setActiveSideTab] = useState<'history' | 'saved'>('history');
  const [isScientificOpen, setIsScientificOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleCalculationComplete = (savedItem: HistoryItem) => {
    setHistory((prev) => [savedItem, ...prev.filter((i) => i.id !== savedItem.id)]);
  };

  const calc = useCalculator({
    userId: user?.id,
    initialMode: isScientificOpen ? 'scientific' : 'standard',
    onCalculationComplete: handleCalculationComplete,
  });

  // Load history & saved
  useEffect(() => {
    historyService.getHistory(user?.id).then(setHistory);
    savedCalculationsService.getSaved(user?.id).then(setSavedCalculations);
  }, [user?.id]);

  // Listen to keyboard shortcut event for history toggle
  useEffect(() => {
    const handleToggle = () => setMobileHistoryOpen((prev) => !prev);
    window.addEventListener('calcora:toggle-history', handleToggle);
    return () => window.removeEventListener('calcora:toggle-history', handleToggle);
  }, []);

  const handleClearAllHistory = async () => {
    await historyService.clearHistory(user?.id);
    setHistory([]);
    showToast('Calculation history cleared');
  };

  const handleDeleteHistoryItem = async (id: string) => {
    await historyService.deleteItem(id, user?.id);
    setHistory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDeleteSaved = async (id: string) => {
    await savedCalculationsService.deleteSaved(id, user?.id);
    setSavedCalculations((prev) => prev.filter((s) => s.id !== id));
    showToast('Saved calculation deleted');
  };

  const handleSaveCalculation = async (title: string) => {
    const targetExpr = calc.previousExpression.replace(/\s*=$/, '') || calc.expression || calc.currentInput;
    const targetResult = calc.lastResult || calc.currentInput;

    const saved = await savedCalculationsService.addSaved(
      {
        title,
        expression: targetExpr,
        result: targetResult,
        numericResult: calc.lastNumericResult ?? parseFloat(targetResult.replace(/,/g, '')) ?? 0,
        mode: calc.mode,
        angleMode: calc.angleMode,
      },
      user?.id
    );

    setSavedCalculations((prev) => [saved, ...prev]);
    showToast(`Saved "${title}" to your calculations`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-calc)] border border-[var(--accent-lime)] text-[var(--text-primary)] shadow-2xl text-xs font-medium animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-lime)]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
            Calculator Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Safe arithmetic parser · Instant precision · Scientific exploration
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Scientific Mode Toggle */}
          <button
            onClick={() => {
              const next = !isScientificOpen;
              setIsScientificOpen(next);
              calc.setMode(next ? 'scientific' : 'standard');
            }}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isScientificOpen
                ? 'bg-[var(--accent-lavender)] text-[#151715] border-[var(--accent-lavender)] shadow-sm'
                : 'bg-[var(--surface-calc)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Scientific Mode</span>
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface-calc)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)]"
            title="View keyboard navigation shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* Mobile History Drawer Button */}
          <button
            onClick={() => setMobileHistoryOpen(true)}
            type="button"
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-calc)] border border-[var(--border-primary)] text-[var(--accent-lime)]"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calculator Surface (Span 7 on lg) */}
        <div className="lg:col-span-7 w-full flex flex-col items-center">
          <div className="w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-[var(--surface-calc)] border border-[var(--border-primary)] shadow-2xl space-y-4">
            {/* Display */}
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
              onSaveClick={() => setIsSaveModalOpen(true)}
            />

            {/* Scientific Panel when open */}
            {isScientificOpen && (
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

            {/* Keypad */}
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

        {/* Right Column: History & Saved Calculations (Span 5 on lg) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col h-[650px] space-y-3">
          {/* Segmented Control Tabs */}
          <div className="p-1 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex items-center gap-1">
            <button
              onClick={() => setActiveSideTab('history')}
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeSideTab === 'history'
                  ? 'bg-[var(--accent-lime)] text-[#151715] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Calculation History ({history.length})</span>
            </button>
            <button
              onClick={() => setActiveSideTab('saved')}
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeSideTab === 'saved'
                  ? 'bg-[var(--accent-lime)] text-[#151715] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Records ({savedCalculations.length})</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeSideTab === 'history' ? (
              <HistoryPanel
                history={history}
                onReuseResult={calc.reuseResult}
                onReuseExpression={calc.reuseExpression}
                onDeleteItem={handleDeleteHistoryItem}
                onClearAll={handleClearAllHistory}
                onSaveItem={(item) => {
                  calc.reuseResult(item.result);
                  setIsSaveModalOpen(true);
                }}
              />
            ) : (
              <div className="h-full bg-[var(--surface-calc)] border border-[var(--border-primary)] rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[var(--accent-lime)]" />
                    <h3 className="font-heading font-semibold text-sm">Saved Calculations</h3>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] font-mono">
                    {savedCalculations.length} saved
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {savedCalculations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-secondary)]">
                      <Bookmark className="w-8 h-8 opacity-30 mb-2" />
                      <p className="text-xs font-medium">No saved calculations</p>
                      <p className="text-[11px] opacity-75 mt-0.5">
                        Click the bookmark icon on any result to save it here with a custom note.
                      </p>
                    </div>
                  ) : (
                    savedCalculations.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-primary)] transition-all flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-[var(--accent-lime)] truncate max-w-[200px]">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] font-mono truncate">
                          {item.expression} =
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                            {item.result}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => calc.reuseResult(item.result)}
                              className="px-2 py-0.5 text-xs font-mono rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--accent-lime)] hover:bg-[var(--accent-lime)] hover:text-[#151715]"
                            >
                              Reuse
                            </button>
                            <button
                              onClick={() => handleDeleteSaved(item.id)}
                              className="p-1 rounded text-[var(--text-secondary)] hover:text-[#C83C42]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer for History */}
      {mobileHistoryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm h-full bg-[var(--surface-calc)] p-4 flex flex-col animate-slide-left">
            <HistoryPanel
              history={history}
              isMobileDrawer
              onClose={() => setMobileHistoryOpen(false)}
              onReuseResult={(res) => {
                calc.reuseResult(res);
                setMobileHistoryOpen(false);
              }}
              onReuseExpression={(expr) => {
                calc.reuseExpression(expr);
                setMobileHistoryOpen(false);
              }}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onSaveItem={(item) => {
                calc.reuseResult(item.result);
                setIsSaveModalOpen(true);
                setMobileHistoryOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Save Calculation Modal */}
      <SaveCalculationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        expression={calc.previousExpression.replace(/\s*=$/, '') || calc.expression || calc.currentInput}
        result={calc.lastResult || calc.currentInput}
        numericResult={calc.lastNumericResult ?? undefined}
        mode={calc.mode}
        angleMode={calc.angleMode}
        onSave={handleSaveCalculation}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
