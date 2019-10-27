import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { SortedMap } from './sorted-map.class';

/**
 * Implementation of a maxima set.
 */
export class MaximaSet<X, Y> {

  constructor(protected compare: CompareFunc<Y> = compareAsNumbers, protected map = new SortedMap<X, Y>()) { }

  /**
   * Adds X, Y pair to the maxima set if there is no better pair in it.
   *
   * @param x X value.
   * @param y Y value.
   */
  add(x: X, y: Y) {
    let element = this.map.findLessOrEqual(x);

    // If map already has comparable (by X) element with better or equal Y
    if (element && this.compare(element[1], y) !== ComparisonResult.LESS) return;
    this.map.set(x, y);
    element = this.map.findGreaterOrEqual(x);

    // Tree-shake less effective elements
    while (element && this.compare(element[1], y) !== ComparisonResult.GREATER) {
      this.map.delete(element[0]);
      element = this.map.findGreaterOrEqual(x);
    }
  }

  /**
   * X, Y pair with largest X not exceeding the specified value.
   *
   * @param x X value.
   * @returns X, Y pair.
   */
  best(x: X): [X, Y] | undefined {
    return this.map.findLessOrEqual(x);
  }

  /**
   * Clears the maxima set.
   */
  clear() {
    this.map.clear();
  }

  *[Symbol.iterator](): Generator<[X, Y]> {
    for (const entry of this.map.entries()) yield entry;
  }

}
