import { ComparisonResult } from './comparator.interface';

/**
 * Compares the two elements a and b as Unicode strings. Both elements are allowed to be of any type.
 * Type conversion is done implicitly by the comparator.
 *
 * @param a Compared element.
 * @param b Compared element.
 * @returns Result of comparison (1 if a is greater than b, -1 if a is less than b, 0 if they are equal).
 */
export function compareAsStrings<T, K>(a: T, b: K): ComparisonResult {
  const _a = String(a);
  const _b = String(b);

  if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}
