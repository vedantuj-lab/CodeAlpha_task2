import { Token, TokenType, ASTNode } from './types';

export class Lexer {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    // Normalize symbols
    this.input = input
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi');
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      const char = this.input[this.pos];

      if (/\s/.test(char)) {
        this.pos++;
        continue;
      }

      // Numbers: e.g. 123, 12.34, .5
      if (/\d/.test(char) || (char === '.' && /\d/.test(this.input[this.pos + 1] || ''))) {
        let numStr = '';
        let hasDot = false;
        const startPos = this.pos;

        while (this.pos < this.input.length) {
          const c = this.input[this.pos];
          if (/\d/.test(c)) {
            numStr += c;
            this.pos++;
          } else if (c === '.' && !hasDot) {
            hasDot = true;
            numStr += c;
            this.pos++;
          } else {
            break;
          }
        }

        tokens.push({ type: 'NUMBER', value: numStr, position: startPos });
        continue;
      }

      // Operators and punctuation
      if (char === '+') {
        tokens.push({ type: 'PLUS', value: '+', position: this.pos++ });
        continue;
      }
      if (char === '-') {
        tokens.push({ type: 'MINUS', value: '-', position: this.pos++ });
        continue;
      }
      if (char === '*') {
        tokens.push({ type: 'MULTIPLY', value: '*', position: this.pos++ });
        continue;
      }
      if (char === '/') {
        tokens.push({ type: 'DIVIDE', value: '/', position: this.pos++ });
        continue;
      }
      if (char === '^') {
        tokens.push({ type: 'POWER', value: '^', position: this.pos++ });
        continue;
      }
      if (char === '%') {
        tokens.push({ type: 'PERCENT', value: '%', position: this.pos++ });
        continue;
      }
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: this.pos++ });
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: this.pos++ });
        continue;
      }
      if (char === '!') {
        tokens.push({ type: 'FUNCTION', value: 'fact', position: this.pos++ });
        continue;
      }

      // Identifiers: functions or constants
      if (/[a-zA-Z]/.test(char)) {
        let ident = '';
        const startPos = this.pos;
        while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
          ident += this.input[this.pos];
          this.pos++;
        }

        ident = ident.toLowerCase();
        if (ident === 'pi' || ident === 'e') {
          tokens.push({ type: 'CONSTANT', value: ident, position: startPos });
        } else {
          tokens.push({ type: 'FUNCTION', value: ident, position: startPos });
        }
        continue;
      }

      throw new Error(`Unexpected character '${char}' at index ${this.pos}`);
    }

    tokens.push({ type: 'EOF', value: '', position: this.pos });
    return tokens;
  }
}

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', position: -1 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  parse(): ASTNode {
    if (this.isAtEnd()) {
      throw new Error('Empty expression');
    }
    const expr = this.expression();
    if (!this.isAtEnd()) {
      throw new Error(`Unexpected token '${this.peek().value}' after expression`);
    }
    return expr;
  }

  // Precedence level 1: Addition & Subtraction
  private expression(): ASTNode {
    let expr = this.term();

    while (this.match('PLUS', 'MINUS')) {
      const op = this.previous().type === 'PLUS' ? '+' : '-';
      const right = this.term();

      // Check if right is a percentage applied to left, e.g. 100 + 10%
      if (right.type === 'Percentage' && !right.base) {
        expr = {
          type: 'BinaryOp',
          operator: op,
          left: expr,
          right: {
            type: 'Percentage',
            operand: right.operand,
            base: expr,
          },
        };
      } else {
        expr = {
          type: 'BinaryOp',
          operator: op,
          left: expr,
          right,
        };
      }
    }

    return expr;
  }

  // Precedence level 2: Multiplication & Division
  private term(): ASTNode {
    let expr = this.factor();

    while (this.match('MULTIPLY', 'DIVIDE')) {
      const op = this.previous().type === 'MULTIPLY' ? '*' : '/';
      const right = this.factor();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 3: Exponentiation (right-associative: 2^3^2 = 2^(3^2))
  private factor(): ASTNode {
    let expr = this.unary();

    if (this.match('POWER')) {
      const right = this.factor(); // right-associative recursion
      return {
        type: 'BinaryOp',
        operator: '^',
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 4: Unary operators (+, -)
  private unary(): ASTNode {
    if (this.match('MINUS')) {
      const operand = this.unary();
      return {
        type: 'UnaryOp',
        operator: '-',
        operand,
      };
    }
    if (this.match('PLUS')) {
      const operand = this.unary();
      return {
        type: 'UnaryOp',
        operator: '+',
        operand,
      };
    }

    return this.postfix();
  }

  // Precedence level 5: Postfix operators (% and factorial !)
  private postfix(): ASTNode {
    let expr = this.primary();

    while (true) {
      if (this.match('PERCENT')) {
        expr = {
          type: 'Percentage',
          operand: expr,
        };
      } else if (this.check('FUNCTION') && this.peek().value === 'fact') {
        this.advance();
        expr = {
          type: 'Factorial',
          operand: expr,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  // Precedence level 6: Primaries, function calls, constants, numbers, parens
  private primary(): ASTNode {
    if (this.match('NUMBER')) {
      const val = parseFloat(this.previous().value);
      let node: ASTNode = {
        type: 'NumberLiteral',
        value: val,
        raw: this.previous().value,
      };

      // Support implicit multiplication: 2pi or 2(3) or 2sin(30)
      if (this.check('CONSTANT') || this.check('LPAREN') || this.check('FUNCTION')) {
        const next = this.primary();
        return {
          type: 'BinaryOp',
          operator: '*',
          left: node,
          right: next,
        };
      }

      return node;
    }

    if (this.match('CONSTANT')) {
      const name = this.previous().value as 'pi' | 'e';
      let node: ASTNode = { type: 'Constant', name };

      // Support implicit multiplication: pi * (2) or pi e
      if (this.check('LPAREN') || this.check('CONSTANT') || this.check('FUNCTION')) {
        const next = this.primary();
        return {
          type: 'BinaryOp',
          operator: '*',
          left: node,
          right: next,
        };
      }
      return node;
    }

    // Function calls, e.g. sin(30), sqrt(16), log(100)
    if (this.match('FUNCTION')) {
      const funcName = this.previous().value;
      if (funcName === 'fact') {
        throw new Error('Factorial (!) must follow a number or expression');
      }

      let arg: ASTNode;
      if (this.match('LPAREN')) {
        arg = this.expression();
        this.consume('RPAREN', `Expected ')' after ${funcName} arguments`);
      } else {
        // Allow shorthand: sin 30 or sqrt 9
        arg = this.unary();
      }

      return {
        type: 'FunctionCall',
        name: funcName,
        args: [arg],
      };
    }

    if (this.match('LPAREN')) {
      const expr = this.expression();
      this.consume('RPAREN', "Unbalanced parentheses: missing closing ')'");

      // Check for implicit multiplication after closing paren: (2+3)(4) or (2+3)pi
      if (this.check('LPAREN') || this.check('NUMBER') || this.check('CONSTANT') || this.check('FUNCTION')) {
        const next = this.primary();
        return {
          type: 'BinaryOp',
          operator: '*',
          left: expr,
          right: next,
        };
      }

      return expr;
    }

    if (this.check('RPAREN')) {
      throw new Error("Unbalanced parentheses: unexpected closing ')'");
    }

    throw new Error(`Unexpected token '${this.peek().value || 'end of input'}'`);
  }
}
