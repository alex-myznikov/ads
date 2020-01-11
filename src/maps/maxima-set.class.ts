import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { IStructure } from '../structure.interface';
import { SortedMap } from './sorted-map.class';

/**
 * Container which stores only pairs forming strictly increasing trend in both keys and values.
 * This structure is based on SortedMap.
 */
export class MaximaSet<X, Y> implements IStructure {

  /**
   * Reference to the underlying sorted map.
   *
   * @protected
   */
  protected map: SortedMap<X, Y>;

  /**
   * Number of pairs in the set.
   *
   * @readonly
   */
  get length(): number {
    return this.map.size;
  }

  /**
   * Creates an instance of MaximaSet.
   *
   * @param iterable Iterable of X, Y pairs to create the new maxima set with.
   * @param compareX Comparison function for pairs sorting by X values. Xs are compared as numbers by default.
   * @param compareY Comparison function for pairs sorting by Y values. Ys are compared as numbers by default.
   */
  constructor(
    iterable: Iterable<[X, Y]> = [],
    protected compareX: CompareFunc<X> = compareAsNumbers,
    protected compareY: CompareFunc<Y> = compareAsNumbers,
  ) {
    this.map = new SortedMap([], compareX);
    for (const pair of iterable) this.add(...pair);
  }

  /**
   * Adds X, Y pair to the maxima set if there is no better pair in it.
   *
   * @param x X value.
   * @param y Y value.
   */
  add(x: X, y: Y) {
    let pair = this.map.findLessOrEqual(x);

    // If map already has comparable (by X) pair with better or equal Y
    if (pair && this.compareY(pair[1], y) !== ComparisonResult.LESS) return;
    this.map.set(x, y);
    pair = this.map.findGreater(x);

    // Tree-shake less effective pair
    while (pair && this.compareY(pair[1], y) !== ComparisonResult.GREATER) {
      this.map.delete(pair[0]);
      pair = this.map.findGreater(x);
    }
  }

  /**
   * Gets X, Y pair with largest X not exceeding the specified value.
   *
   * @param x X value.
   * @returns X, Y pair or undefined if the set is empty.
   */
  getBest(x: X): [X, Y] | undefined {
    return this.map.findLessOrEqual(x);
  }

  /**
   * Clears the set.
   */
  clear() {
    this.map.clear();
  }

  /**
   * Gets X, Y pair with least X.
   *
   * @returns X, Y pair or undefined if the set is empty.
   */
  getFirst(): [X, Y] | undefined {
    return this.map.findMin();
  }

  /**
   * Gets X, Y pair with greatest X.
   *
   * @returns X, Y pair or undefined if the set is empty.
   */
  getLast(): [X, Y] | undefined {
    return this.map.findMax();
  }

  /**
   * Checks whether the set is empty or not.
   *
   * @returns TRUE if the map is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return !this.length;
  }

  *[Symbol.iterator](): IterableIterator<[X, Y]> {
    for (const entry of this.map.entries()) yield entry;
  }

}
