import { ADSError } from '../errors';
import { ComparisonResult } from './comparator.interface';

/**
 * Compares the two elements a and b as float numbers. Both elements are allowed to be of any type besides NaN and
 * any other converted to number as NaN. Throws an error if any of the elements is NaN after the type conversion.
 *
 * @throws {ADSError} Can not compare with NaN.
 * @param a Compared element.
 * @param b Compared element.
 * @returns Result of comparison (1 if a is greater than b, -1 if a is less than b, 0 if they are equal).
 */
export function compareAsNumbers<T, K>(a: T, b: K): ComparisonResult {
  const _a = parseFloat(a as any);
  const _b = parseFloat(b as any);

  if (isNaN(_a) || isNaN(_b)) throw new ADSError('Can not compare with NaN');
  else if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}
