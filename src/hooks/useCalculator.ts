import { useState, useEffect, useCallback, useRef } from 'react';
import { AngleMode, CalculatorMode, HistoryItem } from '../types';
import { calculateExpression } from '../calculator/evaluator';
import { cleanPrecision, formatResultNumber } from '../calculator/formatter';
import { historyService } from '../services/historyService';

export interface UseCalculatorOptions {
  userId?: string;
  initialMode?: CalculatorMode;
  initialAngleMode?: AngleMode;
  onCalculationComplete?: (item: HistoryItem) => void;
}

export function useCalculator({
  userId,
  initialMode = 'standard',
  initialAngleMode = 'deg',
  onCalculationComplete,
}: UseCalculatorOptions = {}) {
  const [expression, setExpression] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousExpression, setPreviousExpression] = useState<string>('');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [lastNumericResult, setLastNumericResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memory, setMemory] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('calcora_memory_val');
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [angleMode, setAngleMode] = useState<AngleMode>(initialAngleMode);
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Sync memory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calcora_memory_val', memory.toString());
    } catch {}
  }, [memory]);

  const clearAll = useCallback(() => {
    setExpression('');
    setCurrentInput('0');
    setPreviousExpression('');
    setLastResult(null);
    setLastNumericResult(null);
    setError(null);
    setIsCalculated(false);
  }, []);

  const deleteLast = useCallback(() => {
    if (error) {
      clearAll();
      return;
    }
    if (isCalculated) {
      clearAll();
      return;
    }

    if (currentInput.length > 1) {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else {
      setCurrentInput('0');
    }
  }, [error, isCalculated, clearAll, currentInput]);

  const inputDigit = useCallback((digit: string) => {
    setError(null);
    if (isCalculated) {
      // Start fresh
      setExpression('');
      setCurrentInput(digit);
      setIsCalculated(false);
      return;
    }

    setCurrentInput((prev) => {
      if (prev === '0') return digit;
      return prev + digit;
    });
  }, [isCalculated]);

  const inputDecimal = useCallback(() => {
    setError(null);
    if (isCalculated) {
      setExpression('');
      setCurrentInput('0.');
      setIsCalculated(false);
      return;
    }

    setCurrentInput((prev) => {
      if (prev.includes('.')) return prev; // prevent repeated decimal
      return prev + '.';
    });
  }, [isCalculated]);

  const toggleSign = useCallback(() => {
    setError(null);
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
      setCurrentInput(currentInput.slice(1));
    } else {
      setCurrentInput('-' + currentInput);
    }
  }, [currentInput]);

  const inputOperator = useCallback((op: '+' | '-' | '*' | '/' | '^') => {
    setError(null);

    // If just calculated, continue chaining using the result
    if (isCalculated && lastResult !== null) {
      setExpression(`${lastNumericResult ?? lastResult} ${op} `);
      setCurrentInput('0');
      setIsCalculated(false);
      return;
    }

    // If current input is active number
    let nextExpr = expression;
    if (currentInput !== '0' || !expression) {
      nextExpr = `${expression ? expression + ' ' : ''}${currentInput} ${op} `;
    } else {
      // Replace trailing operator if user taps a different operator
      nextExpr = expression.replace(/[\+\-\*\/\^]\s*$/, `${op} `);
    }

    setExpression(nextExpr);
    setCurrentInput('0');
    setIsCalculated(false);
  }, [isCalculated, lastResult, lastNumericResult, expression, currentInput]);

  const inputPercentage = useCallback(() => {
    setError(null);
    if (isCalculated && lastNumericResult !== null) {
      const p = cleanPrecision(lastNumericResult / 100);
      setCurrentInput(p.toString());
      setExpression('');
      setIsCalculated(false);
      return;
    }

    // Attach % to current input or evaluate percentage
    const curVal = parseFloat(currentInput);
    if (!isNaN(curVal)) {
      if (expression) {
        // e.g. "100 + 10%"
        const fullExpr = `${expression}${curVal}%`;
        const res = calculateExpression(fullExpr, { angleMode });
        if (res.success && res.value !== undefined) {
          setCurrentInput(res.value.toString());
        }
      } else {
        const val = cleanPrecision(curVal / 100);
        setCurrentInput(val.toString());
      }
    }
  }, [isCalculated, lastNumericResult, currentInput, expression, angleMode]);

  const inputFunction = useCallback((fn: string) => {
    setError(null);
    const num = isCalculated && lastNumericResult !== null ? lastNumericResult : parseFloat(currentInput);

    if (isNaN(num)) {
      setError('Enter a number first');
      return;
    }

    // Instant functions applied to current input
    let targetExpr = `${fn}(${num})`;
    if (fn === 'x2') targetExpr = `(${num})^2`;
    else if (fn === 'x3') targetExpr = `(${num})^3`;
    else if (fn === 'recip') targetExpr = `recip(${num})`;
    else if (fn === 'fact') targetExpr = `fact(${num})`;

    const res = calculateExpression(targetExpr, { angleMode });
    if (res.success && res.value !== undefined) {
      setPreviousExpression(`${targetExpr} =`);
      setCurrentInput(res.value.toString());
      setLastResult(res.formatted || res.value.toString());
      setLastNumericResult(res.value);
      setIsCalculated(true);

      const histItem: Omit<HistoryItem, 'id'> = {
        expression: targetExpr,
        result: res.formatted || res.value.toString(),
        numericResult: res.value,
        mode,
        angleMode,
        timestamp: Date.now(),
      };
      historyService.addHistory(histItem, userId).then((saved) => {
        onCalculationComplete?.(saved);
      });
    } else {
      setError(res.error || 'Invalid domain or calculation error');
    }
  }, [isCalculated, lastNumericResult, currentInput, angleMode, mode, userId, onCalculationComplete]);

  const inputConstant = useCallback((constant: 'pi' | 'e') => {
    setError(null);
    const val = constant === 'pi' ? Math.PI : Math.E;
    setCurrentInput(cleanPrecision(val).toString());
    if (isCalculated) {
      setExpression('');
      setIsCalculated(false);
    }
  }, [isCalculated]);

  const inputParenthesis = useCallback((paren: '(' | ')') => {
    setError(null);
    if (paren === '(') {
      if (currentInput !== '0') {
        setExpression((prev) => `${prev ? prev + ' ' : ''}${currentInput} * (`);
      } else {
        setExpression((prev) => `${prev ? prev + ' ' : ''}(`);
      }
      setCurrentInput('0');
    } else {
      // Closing paren
      setExpression((prev) => `${prev} ${currentInput})`);
      setCurrentInput('0');
    }
  }, [currentInput]);

  const calculate = useCallback(() => {
    setError(null);

    // Build complete expression to evaluate
    let fullExpr = '';
    if (expression) {
      if (currentInput !== '0' || !expression.trim().endsWith(')')) {
        fullExpr = `${expression} ${currentInput}`.trim();
      } else {
        fullExpr = expression.trim();
      }
    } else {
      fullExpr = currentInput.trim();
    }

    if (!fullExpr) return;

    // Check unbalanced parens and auto-close if reasonable
    const openParens = (fullExpr.match(/\(/g) || []).length;
    const closeParens = (fullExpr.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      fullExpr += ')'.repeat(openParens - closeParens);
    }

    const res = calculateExpression(fullExpr, { angleMode });

    if (res.success && res.value !== undefined) {
      setPreviousExpression(`${fullExpr} =`);
      setLastResult(res.formatted || res.value.toString());
      setLastNumericResult(res.value);
      setCurrentInput(res.formatted || res.value.toString());
      setExpression('');
      setIsCalculated(true);

      const histItem: Omit<HistoryItem, 'id'> = {
        expression: fullExpr,
        result: res.formatted || res.value.toString(),
        numericResult: res.value,
        mode,
        angleMode,
        timestamp: Date.now(),
      };
      historyService.addHistory(histItem, userId).then((saved) => {
        onCalculationComplete?.(saved);
      });
    } else {
      setError(res.error || 'Calculation Error');
    }
  }, [expression, currentInput, angleMode, mode, userId, onCalculationComplete]);

  // Memory Functions
  const memoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  const memoryRecall = useCallback(() => {
    setCurrentInput(cleanPrecision(memory).toString());
    if (isCalculated) {
      setExpression('');
      setIsCalculated(false);
    }
  }, [memory, isCalculated]);

  const memoryAdd = useCallback(() => {
    const cur = parseFloat(currentInput);
    if (!isNaN(cur)) {
      setMemory((prev) => cleanPrecision(prev + cur));
    }
  }, [currentInput]);

  const memorySubtract = useCallback(() => {
    const cur = parseFloat(currentInput);
    if (!isNaN(cur)) {
      setMemory((prev) => cleanPrecision(prev - cur));
    }
  }, [currentInput]);

  const memoryStore = useCallback(() => {
    const cur = parseFloat(currentInput);
    if (!isNaN(cur)) {
      setMemory(cur);
    }
  }, [currentInput]);

  const reuseResult = useCallback((val: string) => {
    // Strip commas from formatted string
    const clean = val.replace(/,/g, '');
    setCurrentInput(clean);
    setIsCalculated(false);
    setError(null);
  }, []);

  const reuseExpression = useCallback((expr: string) => {
    setExpression('');
    setCurrentInput(expr);
    setIsCalculated(false);
    setError(null);
  }, []);

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        // Handled at parent level or component toggle
        window.dispatchEvent(new CustomEvent('calcora:toggle-history'));
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('calcora:copy-result'));
        return;
      }

      // Standard Keys
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        inputDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        inputOperator(e.key);
      } else if (e.key === '*') {
        e.preventDefault();
        inputOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        inputOperator('/');
      } else if (e.key === '^') {
        e.preventDefault();
        inputOperator('^');
      } else if (e.key === '%') {
        e.preventDefault();
        inputPercentage();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        inputParenthesis(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercentage,
    inputParenthesis,
    calculate,
    deleteLast,
    clearAll,
  ]);

  return {
    expression,
    currentInput,
    previousExpression,
    lastResult,
    lastNumericResult,
    error,
    memory,
    angleMode,
    mode,
    isCalculated,
    setAngleMode,
    setMode,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercentage,
    inputFunction,
    inputConstant,
    inputParenthesis,
    toggleSign,
    calculate,
    clearAll,
    deleteLast,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryStore,
    reuseResult,
    reuseExpression,
  };
}
