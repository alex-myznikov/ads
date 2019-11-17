import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';

/**
 * Finds item in sorted array greater than or equal to the specified target.
 *
 * @param arr Array to search in.
 * @param target Search target.
 * @param from Index to start search from (inclusive). Will start from 0 by default.
 * @param to Index to stop search at (exclusive). Will examine the whole array by default.
 * @param compare Comparison function. Items are compared as numbers by default.
 * @returns Object with 'index' field representing an item the search has stopped at
 * and 'exact' field telling whether the target was matched exactly.
 */
export function binarySearch<T>(
  arr: T[],
  target: T,
  from?: number,
  to?: number,
  compare: CompareFunc<T> = compareAsNumbers,
): { index: number, exact: boolean } {
  let low = Math.max(from || 0, 0);
  let high = (to ? Math.min(to, arr.length) : arr.length) - 1;
  let mid: number;

  while (low <= high) {
    mid = Math.floor((low + high) / 2);

    switch (compare(arr[mid], target)) {
      case ComparisonResult.EQUAL:
        return { index: mid, exact: true };
      case ComparisonResult.GREATER:
        high = mid - 1;
        break;
      default:
        low = mid + 1;
    }
  }

  return { index: high + 1, exact: false };
}
