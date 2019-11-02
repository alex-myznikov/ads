type PrecomputedPattern = [string, number[]];

/**
 * Finds pattern enclosure in the source string using Knuth-Morris-Pratt algorithm.
 *
 * @param source Source string.
 * @param pattern Pattern as string or precomputed pattern.
 * @returns The leftmost index at which the pattern begins in the source string or -1.
 */
export function indexOfKMP(source: string, pattern: string | PrecomputedPattern): number {
  let patternString: string;
  let overlaps: number[];

  if (typeof pattern == 'string') {
    if (!pattern.length) return 0;
    [patternString, overlaps] = precomputePattern(pattern);
  } else [patternString, overlaps] = pattern;

  const patternLastIndex = patternString.length - 1;
  let i = 0;
  let j = 0;
  let k = i - j;

  while (i < source.length) {
    if (source[i] === patternString[k = i - j]) {
      if (k === patternLastIndex) return j;
      i++;
    } else if (k > 0) j = i - overlaps[k - 1];
    else j = ++i;
  }

  return -1;
}

/**
 * Precomputes pattern overlaps between front and tail character sequences.
 *
 * @param pattern Pattern string.
 * @returns Precomputed pattern.
 */
export function precomputePattern(pattern: string): PrecomputedPattern {
  if (!pattern.length) throw new Error('Can not precompute an empty pattern');

  const overlaps = [0];
  let i = 1;
  let j = 0;

  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) overlaps[i++] = ++j;
    else if (j > 0) j = overlaps[j - 1];
    else overlaps[i++] = 0;
  }

  return [pattern, overlaps];
}
