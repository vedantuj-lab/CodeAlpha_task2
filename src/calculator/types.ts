import { AngleMode } from '../types';

export type TokenType =
  | 'NUMBER'
  | 'PLUS'
  | 'MINUS'
  | 'MULTIPLY'
  | 'DIVIDE'
  | 'POWER'
  | 'PERCENT'
  | 'LPAREN'
  | 'RPAREN'
  | 'FUNCTION'
  | 'CONSTANT'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type ASTNode =
  | { type: 'NumberLiteral'; value: number; raw: string }
  | { type: 'Constant'; name: 'pi' | 'e' }
  | { type: 'BinaryOp'; operator: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
  | { type: 'UnaryOp'; operator: '+' | '-'; operand: ASTNode }
  | { type: 'Percentage'; operand: ASTNode; base?: ASTNode } // e.g. 50 + 10% or 20%
  | { type: 'FunctionCall'; name: string; args: ASTNode[] }
  | { type: 'Factorial'; operand: ASTNode };

export interface CalculationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

export interface CalculationOptions {
  angleMode: AngleMode;
}
