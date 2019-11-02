/**
 * Finds pattern enclosure in the source string using Boyer-Moore algorithm.
 *
 * @param source Source string.
 * @param pattern Pattern string.
 * @returns The leftmost index at which the pattern begins in the source string or -1.
 */
export function indexOfBM(source: string, pattern: string): number {
  if (!pattern.length) return 0;

  const occurencies = pattern.split('').reduce((acc, cur, index) => acc.set(cur, index), new Map());
  const patternLastIndex = pattern.length - 1;
  let i = patternLastIndex;
  let j = 0;
  let k = i - j;

  while (i < source.length) {
    if (source[i] === pattern[k = i - j]) {
      if (i === j) return j;
      i--;
    } else {
      j += Math.max(k - occurencies.get(source[i]) || 0, 1);
      i = j + patternLastIndex;
    }
  }

  return -1;
}
