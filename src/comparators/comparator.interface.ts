/**
 * Result of comparing two elements. Read it as 'a is <ComparisonResult> than b'.
 */
export enum ComparisonResult {
  GREATER = 1,
  EQUAL = 0,
  LESS = -1,
}

/**
 * Compares elements a and b.
 *
 * @template T Type of compared elements.
 * @template K Optional type for element b used if comparator does support type conversion.
 * @param a Compared element.
 * @param b Compared element.
 * @returns Result of comparison (1 if a is greater than b, -1 if a is less than b, 0 if they are equal).
 */
export interface IComparator<T, K = T> {
  (a: T, b: K): ComparisonResult;
}
