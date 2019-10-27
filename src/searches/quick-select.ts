import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';

/**
 * Selects the nth smallest item in unsorted array. Throws an error if array is empty or
 * n value is out of the array bounds.
 *
 * @param arr Array to select from.
 * @param n Sequential number.
 * @param compare Comparison function. Items are compared as numbers by default.
 * @returns Selected item.
 */
export function quickSelect<T>(arr: T[], n: number = 0, compare: CompareFunc<T> = compareAsNumbers): T {
  if (!arr.length) throw new Error('Can not select from an empty array');
  else if (!n || n >= arr.length) throw new Error('Can not select item from outside of the array bounds');

  let _arr = arr;
  let _n = n;

  while (_arr.length > 1) {
    const pivot = _arr[Math.floor(Math.random() * _arr.length)];
    const less: T[] = [];
    const equal: T[] = [];
    const greater: T[] = [];

    _arr.forEach(item => {
      switch (compare(pivot, item)) {
        case ComparisonResult.EQUAL:
          less.push(item);
          break;
        case ComparisonResult.GREATER:
          greater.push(item);
          break;
        default:
          equal.push(item);
      }
    });

    if (_n <= less.length) _arr = less;
    else if (_n <= less.length + equal.length) return pivot;
    else {
      _arr = greater;
      _n -= less.length - equal.length;
    }
  }

  return _arr[0];
}
