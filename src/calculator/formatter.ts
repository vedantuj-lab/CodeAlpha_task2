/**
 * Formats numbers reliably for clean display without ugly IEEE-754 precision artifacts
 * (e.g. 0.1 + 0.2 = 0.30000000000000004 -> "0.3")
 */
export function cleanPrecision(num: number): number {
  if (!Number.isFinite(num)) return num;
  // Use 12 significant digits to strip low-order floating point noise
  const parsed = parseFloat(num.toPrecision(12));
  // If extremely close to integer, snap to integer
  if (Math.abs(parsed - Math.round(parsed)) < 1e-11) {
    return Math.round(parsed);
  }
  return parsed;
}

export function formatResultNumber(num: number, maxDecimals: number = 10): string {
  if (Number.isNaN(num)) return 'Error: Not a number';
  if (!Number.isFinite(num)) {
    return num > 0 ? 'Error: Overflow' : 'Error: Underflow';
  }

  const cleaned = cleanPrecision(num);

  // If very large or very small (non-zero), use exponential notation
  const abs = Math.abs(cleaned);
  if (abs !== 0 && (abs >= 1e14 || abs < 1e-7)) {
    const expStr = cleaned.toExponential(8);
    // clean up 1.00000000e+15 -> 1e+15
    return expStr.replace(/\.?0+e/, 'e');
  }

  // Format decimal with commas on integer part
  const parts = cleaned.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  if (parts.length > 1) {
    // Truncate trailing zeros if any
    let dec = parts[1];
    if (dec.length > maxDecimals) {
      dec = dec.slice(0, maxDecimals);
    }
    dec = dec.replace(/0+$/, '');
    return dec.length > 0 ? `${integerPart}.${dec}` : integerPart;
  }

  return integerPart;
}

/**
 * Normalizes user mathematical display strings (replacing * with ×, / with ÷)
 */
export function formatExpressionDisplay(expr: string): string {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/(?<=\S)-(?=\S)/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}
