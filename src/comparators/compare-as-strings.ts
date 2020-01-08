import { ComparisonResult } from './comparator.interface';

export function compareAsStrings<T, K>(a: T, b: K): ComparisonResult {
  const _a = String(a);
  const _b = String(b);

  if (_a > _b) return ComparisonResult.GREATER;
  else if (_a < _b) return ComparisonResult.LESS;

  return ComparisonResult.EQUAL;
}
