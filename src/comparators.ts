export enum ComparisonResult {
  GREATER = 1,
  EQUAL = 0,
  LESS = -1,
}

/**
 * Compares a and b.
 *
 * @param a Comparison parameter.
 * @param b Comparison parameter.
 * @returns Result of comparison (1 if a is greater than b, -1 if a is less than b, 0 if they are equal).
 */
export interface CompareFunc<T, K = T> {
  (a: T, b: K): ComparisonResult;
}

export function compareAsNumbers<T, K>(a: T, b: K): ComparisonResult {
  const _a = parseFloat(a as any);
  const _b = parseFloat(b as any);

  if (isNaN(_a) || isNaN(_b)) throw new Error('Can not compare with NaN');
  else if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}

export function compareAsStrings<T, K>(a: T, b: K): ComparisonResult {
  const _a = String(a);
  const _b = String(b);

  if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}
