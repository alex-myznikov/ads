import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { binarySearch } from '../searches/binary-search';

/**
 * Implementation of a sorted map.
 */
export class SortedMap<K, V> implements Map<K, V> {

  /**
   * Sorted collection of key-value pairs.
   *
   * @protected
   */
  protected arr: Array<[K, V]>;

  /**
   * Number of key-value pairs in the map.
   *
   * @readonly
   */
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

  /**
   * Clears the map.
   */
  clear() {
    this.arr = [];
  }

  /**
   * Deletes key-value pair from the map by key.
   *
   * @param key Pair key.
   * @returns TRUE if pair existed and has been removed, FALSE otherwise.
   */
  delete(key: K): boolean {
    const { index, exact } = this.findIndex(key);

    if (!exact) return false;
    this.arr.splice(index, 1);

    return true;
  }

  entries(): IterableIterator<[K, V]> {
    return this.arr.values();
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
      key as any,
      0, this.size,
      (a: [K, V], b: any) => this.compare(a[0], b),
    );
  }

  /**
   * Finds the leftmost key-value pair with key greater than the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the greatest or the map is empty.
   */
  findGreater(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);

    return exact ? this.arr[index + 1] : this.arr[index];
  }

  /**
   * Finds the leftmost key-value pair with key greater than or equal to the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the greatest or the map is empty.
   */
  findGreaterOrEqual(key: K): [K, V] | undefined {
    return this.arr[this.findIndex(key).index];
  }

  /**
   * Finds the rightmost key-value pair with key less than the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the smallest or the map is empty.
   */
  findLess(key: K): [K, V] | undefined {
    return this.arr[this.findIndex(key).index - 1];
  }

  /**
   * Finds the rightmost key-value pair with key less than or equal to the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the smallest or the map is empty.
   */
  findLessOrEqual(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);

    return exact ? this.arr[index] : this.arr[index - 1];
  }

  /**
   * Finds the greatest (by key) key-value pair in the map.
   *
   * @returns Key-value pair or undefined if the map is empty.
   */
  findMax(): [K, V] | undefined {
    return this.arr[this.size - 1];
  }

  /**
   * Finds the smallest (by key) key-value pair in the map.
   *
   * @returns Key-value pair or undefined if the map is empty.
   */
  findMin(): [K, V] | undefined {
    return this.arr[0];
  }

  /**
   * Returns an iterable of key-value pairs for every pair in the map with start <= key < stop.
   *
   * @param start Pair key to start from.
   * @param stop Pair key to stop on.
   * @returns Iterable of key-value pairs.
   */
  findRange(start: K, stop: K): IterableIterator<[K, V]> {
    let current = this.findIndex(start).index;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => ({
        done: current < this.size ? this.compare(this.arr[current][0], stop) !== ComparisonResult.LESS : true,
        value: this.arr[current++],
      }),
    };

    return iterator;
  }

  /**
   * Executes a provided function once per each key/value pair in the Map
   *
   * @param callbackfn A function that accepts up to three arguments.
   * forEach calls the callbackfn function one time for each key-value pair in the map.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
    this.arr.forEach((value: [K, V]) => callbackfn(value[1], value[0], this), thisArg);
  }

  /**
   * Gets key-value pair from the map by key. Throws an error if key not found.
   *
   * @param key Pair key.
   * @returns Pair value.
   */
  get(key: K): V {
    const { index, exact } = this.findIndex(key);

    if (!exact) throw new Error('Key not found');

    return this.arr[index][1];
  }

  /**
   * Checks key-value pair presence in the map by key.
   *
   * @param key Pair key.
   * @returns TRUE if pair exists, FALSE otherwise.
   */
  has(key: K): boolean {
    return this.findIndex(key).exact;
  }

  /**
   * Checks whether the map is empty or not.
   *
   * @returns TRUE if the map is empty, FALSE otherwise.
   */
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

  /**
   * Returns an iterable of key-value pairs for every key-value pair in the map in reverse order.
   *
   * @returns Iterable of key-value pairs.
   */
  reversed(): IterableIterator<[K, V]> {
    let current = this.size - 1;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => ({ done: current < 0, value: this.arr[current--] }),
    };

    return iterator;
  }

  /**
   * Sets key-value pair in the map by key.
   *
   * @param key Pair key.
   * @param value key-value pair value.
   * @returns Instance of the map.
   */
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

  *[Symbol.iterator](): Generator<[K, V]> {
    for (const entry of this.entries()) yield entry;
  }

}
