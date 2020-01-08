import { ADSError } from '../errors';
import { ComparisonResult } from './comparator.interface';

export function compareAsNumbers<T, K>(a: T, b: K): ComparisonResult {
  const _a = parseFloat(a as any);
  const _b = parseFloat(b as any);

  if (isNaN(_a) || isNaN(_b)) throw new ADSError('Can not compare with NaN');
  else if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}
