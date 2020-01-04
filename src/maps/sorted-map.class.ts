import { binarySearch } from '../searches/binary-search';
import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { ISortedMap } from './sorted-map.interface';

/**
 * Implementation of a sorted map.
 */
export class SortedMap<K, V> implements ISortedMap<K, V> {

  /**
   * Sorted collection of key-value pairs.
   *
   * @protected
   */
  protected arr: Array<[K, V]>;

  get size() {
    return this.arr.length;
  }

  get [Symbol.toStringTag](): string {
    return 'SortedMap';
  }

  /**
   * Creates an instance of SortedMap.
   *
   * @param iterable Iterable of pairs to create the new map with.
   * @param compare Comparison function for key-value pairs sorting by key. Keys are compared as numbers by default.
   */
  constructor(iterable: Iterable<[K, V]> = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    this.arr = [];
    for (const pair of iterable) this.set(...pair);
  }

  clear() {
    this.arr = [];
  }

  delete(key: K): boolean {
    const { index, exact } = this.findIndex(key);

    if (!exact) return false;
    this.arr.splice(index, 1);

    return true;
  }

  *entries(): IterableIterator<[K, V]> {
    for (const value of this.arr.values()) yield [value[0], value[1]];
  }

  /**
   * Finds the leftmost key-value pair with key greater than or equal to the specified key.
   *
   * @protected
   * @param key Pair key.
   * @returns Pair index and exact match result. Index equals to the map size if no key greater than the specified.
   */
  protected findIndex(key: K): { index: number; exact: boolean; } {
    return binarySearch(
      this.arr,
      key,
      0, this.size,
      (a: [K, V], b: K) => this.compare(a[0], b),
    );
  }

  findGreater(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);
    const pair: [K, V] | undefined = exact ? this.arr[index + 1] : this.arr[index];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findGreaterOrEqual(key: K): [K, V] | undefined {
    const pair: [K, V] | undefined = this.arr[this.findIndex(key).index];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findLess(key: K): [K, V] | undefined {
    const pair: [K, V] | undefined = this.arr[this.findIndex(key).index - 1];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findLessOrEqual(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);
    const pair: [K, V] | undefined = exact ? this.arr[index] : this.arr[index - 1];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findMax(): [K, V] | undefined {
    const pair: [K, V] | undefined = this.arr[this.size - 1];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findMin(): [K, V] | undefined {
    const pair: [K, V] | undefined = this.arr[0];

    return pair ? [pair[0], pair[1]] : pair;
  }

  findRange(start: K, stop: K): IterableIterator<[K, V]> {
    let current = this.findIndex(start).index;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => {
        const done = current < this.size ? this.compare(this.arr[current][0], stop) !== ComparisonResult.LESS : true;
        const pair: [K, V] | undefined = this.arr[current++];

        return { done, value: pair ? [pair[0], pair[1]] as [K, V] : pair };
      },
    };

    return iterator;
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
    this.arr.forEach((value: [K, V]) => callbackfn(value[1], value[0], this), thisArg);
  }

  get(key: K): V {
    const { index, exact } = this.findIndex(key);

    if (!exact) throw new Error('Key not found');

    return this.arr[index][1];
  }

  has(key: K): boolean {
    return this.findIndex(key).exact;
  }

  isEmpty(): boolean {
    return !this.size;
  }

  keys(): IterableIterator<K> {
    let current = 0;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => ({
        done: current >= this.size,
        value: (this.arr[current++] || [])[0],
      }),
    };

    return iterator;
  }

  reversed(): IterableIterator<[K, V]> {
    let current = this.size - 1;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => {
        const done = current < 0;
        const pair: [K, V] | undefined = this.arr[current--];

        return { done, value: pair ? [pair[0], pair[1]] as [K, V] : pair };
      },
    };

    return iterator;
  }

  set(key: K, value: V): this {
    const { index, exact } = this.findIndex(key);

    if (exact) this.arr[index][1] = value;
    else this.arr.splice(index, 0, [key, value]);

    return this;
  }

  values(): IterableIterator<V> {
    let current = 0;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => ({
        done: current >= this.size,
        value: (this.arr[current++] || [])[1],
      }),
    };

    return iterator;
  }

  *[Symbol.iterator](): IterableIterator<[K, V]> {
    for (const entry of this.entries()) yield entry;
  }

}
