import { ASTNode, CalculationOptions, CalculationResult } from './types';
import { Lexer, Parser } from './parser';
import { cleanPrecision, formatResultNumber } from './formatter';

export class Evaluator {
  private options: CalculationOptions;

  constructor(options: CalculationOptions = { angleMode: 'deg' }) {
    this.options = options;
  }

  evaluate(node: ASTNode): number {
    switch (node.type) {
      case 'NumberLiteral':
        return node.value;

      case 'Constant':
        if (node.name === 'pi') return Math.PI;
        if (node.name === 'e') return Math.E;
        throw new Error(`Unknown constant: ${node.name}`);

      case 'UnaryOp': {
        const val = this.evaluate(node.operand);
        return node.operator === '-' ? -val : val;
      }

      case 'BinaryOp': {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);

        switch (node.operator) {
          case '+':
            return cleanPrecision(left + right);
          case '-':
            return cleanPrecision(left - right);
          case '*':
            return cleanPrecision(left * right);
          case '/':
            if (right === 0) {
              throw new Error('Cannot divide by zero');
            }
            return cleanPrecision(left / right);
          case '^': {
            if (left === 0 && right < 0) {
              throw new Error('Cannot divide by zero in 0^negative');
            }
            if (left < 0 && !Number.isInteger(right)) {
              throw new Error('Complex result: negative base with fractional power');
            }
            const res = Math.pow(left, right);
            if (!Number.isFinite(res)) {
              throw new Error('Calculation overflow');
            }
            return cleanPrecision(res);
          }
          default:
            throw new Error(`Unknown operator ${(node as any).operator}`);
        }
      }

      case 'Percentage': {
        const percentVal = this.evaluate(node.operand);
        if (node.base) {
          const baseVal = this.evaluate(node.base);
          // e.g. baseVal * (percentVal / 100)
          return cleanPrecision(baseVal * (percentVal / 100));
        }
        return cleanPrecision(percentVal / 100);
      }

      case 'Factorial': {
        const val = this.evaluate(node.operand);
        return this.factorial(val);
      }

      case 'FunctionCall': {
        const arg = this.evaluate(node.args[0]);
        return this.evaluateFunction(node.name, arg);
      }

      default:
        throw new Error('Invalid calculation AST');
    }
  }

  private factorial(n: number): number {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('Factorial requires a non-negative integer (n >= 0)');
    }
    if (n > 170) {
      throw new Error('Factorial overflow (maximum input is 170)');
    }
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  private evaluateFunction(name: string, x: number): number {
    const isDeg = this.options.angleMode === 'deg';
    const toRad = (val: number) => (val * Math.PI) / 180;
    const toDeg = (val: number) => (val * 180) / Math.PI;

    switch (name.toLowerCase()) {
      // Trigonometric
      case 'sin': {
        const rad = isDeg ? toRad(x) : x;
        // Snap common angles for degrees to prevent precision noise
        if (isDeg) {
          const mod = Math.abs(x % 360);
          if (mod === 0 || mod === 180) return 0;
          if (mod === 30 || mod === 150) return x > 0 ? 0.5 : -0.5;
          if (mod === 90) return x > 0 ? 1 : -1;
          if (mod === 210 || mod === 330) return x > 0 ? -0.5 : 0.5;
          if (mod === 270) return x > 0 ? -1 : 1;
        }
        return cleanPrecision(Math.sin(rad));
      }

      case 'cos': {
        const rad = isDeg ? toRad(x) : x;
        if (isDeg) {
          const mod = Math.abs(x % 360);
          if (mod === 90 || mod === 270) return 0;
          if (mod === 0) return 1;
          if (mod === 60 || mod === 300) return 0.5;
          if (mod === 120 || mod === 240) return -0.5;
          if (mod === 180) return -1;
        }
        return cleanPrecision(Math.cos(rad));
      }

      case 'tan': {
        if (isDeg) {
          const mod = Math.abs(x % 180);
          if (mod === 90) {
            throw new Error('Tangent is undefined at 90° (and 270°)');
          }
          if (mod === 45) return (x % 180 === 45) ? 1 : -1;
          if (mod === 135) return -1;
          if (mod === 0) return 0;
        }
        const rad = isDeg ? toRad(x) : x;
        const res = Math.tan(rad);
        if (Math.abs(res) > 1e14) {
          throw new Error('Tangent is undefined at this angle');
        }
        return cleanPrecision(res);
      }

      // Inverse Trigonometric
      case 'asin': {
        if (x < -1 || x > 1) {
          throw new Error('asin domain error: input must be between -1 and 1');
        }
        const res = Math.asin(x);
        return cleanPrecision(isDeg ? toDeg(res) : res);
      }

      case 'acos': {
        if (x < -1 || x > 1) {
          throw new Error('acos domain error: input must be between -1 and 1');
        }
        const res = Math.acos(x);
        return cleanPrecision(isDeg ? toDeg(res) : res);
      }

      case 'atan': {
        const res = Math.atan(x);
        return cleanPrecision(isDeg ? toDeg(res) : res);
      }

      // Logarithms
      case 'log':
      case 'log10': {
        if (x <= 0) {
          throw new Error('Invalid domain: log10 requires x > 0');
        }
        return cleanPrecision(Math.log10(x));
      }

      case 'ln': {
        if (x <= 0) {
          throw new Error('Invalid domain: ln requires x > 0');
        }
        return cleanPrecision(Math.log(x));
      }

      // Roots & Powers
      case 'sqrt': {
        if (x < 0) {
          throw new Error('Invalid domain: square root of negative number in real mode');
        }
        return cleanPrecision(Math.sqrt(x));
      }

      case 'cbrt':
        return cleanPrecision(Math.cbrt(x));

      case 'abs':
        return Math.abs(x);

      case 'inv':
      case 'recip': {
        if (x === 0) {
          throw new Error('Cannot divide by zero (1/0)');
        }
        return cleanPrecision(1 / x);
      }

      case 'fact':
        return this.factorial(x);

      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }
}

/**
 * Top-level calculate function that coordinates lexing, parsing, evaluation, and formatting
 */
export function calculateExpression(
  expression: string,
  options: CalculationOptions = { angleMode: 'deg' }
): CalculationResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { success: false, error: 'Empty expression' };
  }

  try {
    const lexer = new Lexer(trimmed);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator(options);
    const numericValue = evaluator.evaluate(ast);

    if (Number.isNaN(numericValue)) {
      return { success: false, error: 'Result is not a number' };
    }
    if (!Number.isFinite(numericValue)) {
      return { success: false, error: 'Result is infinite (overflow)' };
    }

    return {
      success: true,
      value: numericValue,
      formatted: formatResultNumber(numericValue),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Calculation error',
    };
  }
}
