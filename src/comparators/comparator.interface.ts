/**
 * Result of comparing two elements. Read it as 'a is <ComparisonResult> than b'.
 */
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
