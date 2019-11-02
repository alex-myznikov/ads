/**
 * Finds the longest (one of, if several) common substring of two given strings.
 *
 * @param x X string.
 * @param y Y string.
 * @returns Longest common substring of X and Y.
 */
export function findLSC(x: string, y: string): string {
  let lcs = '';

  if (!x.length || !y.length) return lcs;

  let currentRow = new Array(y.length);
  let nextRow = new Array(y.length);
  let swap;
  let maxLength = 0;

  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      if (x[i] === y[j]) {
        const length = nextRow[j + 1] = (currentRow[j] || 0) + 1;

        if (length > maxLength) {
          maxLength = length;
          lcs += y[j];
        }
      } else nextRow[j + 1] = Math.max(currentRow[j + 1] || 0, nextRow[j] || 0);
    }

    swap = currentRow;
    currentRow = nextRow;
    nextRow = swap;
  }

  return lcs;
}
