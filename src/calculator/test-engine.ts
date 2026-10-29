import { calculateExpression } from './evaluator';

export interface TestCaseResult {
  name: string;
  expression: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes?: string;
}

export function runCalculationTestSuite(): TestCaseResult[] {
  const tests: Array<{
    name: string;
    expression: string;
    expected: string;
    angleMode?: 'deg' | 'rad';
    isErrorExpected?: boolean;
  }> = [
    // 24.1 Arithmetic tests
    { name: 'Addition 25 + 15', expression: '25 + 15', expected: '40' },
    { name: 'Subtraction 25 - 15', expression: '25 - 15', expected: '10' },
    { name: 'Multiplication 12 * 8', expression: '12 * 8', expected: '96' },
    { name: 'Division 100 / 4', expression: '100 / 4', expected: '25' },
    { name: 'Operator Precedence 7 + 2 * 3', expression: '7 + 2 * 3', expected: '13' },
    { name: 'Decimals 0.1 + 0.2', expression: '0.1 + 0.2', expected: '0.3' },
    { name: 'Negative Values -5 + 8', expression: '-5 + 8', expected: '3' },
    { name: 'Parentheses (2 + 3) * 4', expression: '(2 + 3) * 4', expected: '20' },
    
    // Percentage
    { name: 'Percentage 100 + 10%', expression: '100 + 10%', expected: '110' },
    { name: 'Direct Percentage 50%', expression: '50%', expected: '0.5' },

    // 24.2 Error tests
    { name: 'Division by zero', expression: '10 / 0', expected: 'Cannot divide by zero', isErrorExpected: true },
    { name: 'Sqrt of negative', expression: 'sqrt(-1)', expected: 'Invalid domain', isErrorExpected: true },
    { name: 'Log of zero', expression: 'log(0)', expected: 'Invalid domain', isErrorExpected: true },
    { name: 'Negative factorial', expression: 'fact(-5)', expected: 'Factorial requires a non-negative integer', isErrorExpected: true },
    { name: 'Unbalanced parens', expression: '(2 + 3', expected: 'Unbalanced parentheses', isErrorExpected: true },

    // 24.3 Scientific tests
    { name: 'sin(30°) in deg mode', expression: 'sin(30)', expected: '0.5', angleMode: 'deg' },
    { name: 'cos(60°) in deg mode', expression: 'cos(60)', expected: '0.5', angleMode: 'deg' },
    { name: 'tan(45°) in deg mode', expression: 'tan(45)', expected: '1', angleMode: 'deg' },
    { name: 'log10(100)', expression: 'log(100)', expected: '2' },
    { name: 'ln(e)', expression: 'ln(e)', expected: '1' },
    { name: 'sqrt(81)', expression: 'sqrt(81)', expected: '9' },
    { name: '2^3 exponentiation', expression: '2^3', expected: '8' },
    { name: '5! factorial', expression: 'fact(5)', expected: '120' },
  ];

  return tests.map((t) => {
    const res = calculateExpression(t.expression, { angleMode: t.angleMode || 'deg' });
    if (t.isErrorExpected) {
      const passed = !res.success && (res.error?.toLowerCase().includes(t.expected.toLowerCase()) ?? false);
      return {
        name: t.name,
        expression: t.expression,
        expected: `Error containing "${t.expected}"`,
        actual: res.success ? `Unexpected success: ${res.formatted}` : `Error: ${res.error}`,
        passed,
      };
    } else {
      const passed = res.success && res.formatted === t.expected;
      return {
        name: t.name,
        expression: t.expression,
        expected: t.expected,
        actual: res.success ? (res.formatted || '') : `Error: ${res.error}`,
        passed,
      };
    }
  });
}
