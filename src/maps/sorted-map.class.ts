import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { binarySearch } from '../searches/binary-search';

/**
 * Implementation of a sorted map.
 */
export class SortedMap<K, V> implements Map<K, V> {

  /**
   * Sorted collection of elements.
   *
   * @protected
   */
  protected arr: Array<[K, V]>;

  [Symbol.toStringTag]: '[object SortedMap]';

  /**
   * Number of elements in the map.
   *
   * @readonly
   */
  get size() {
    return this.arr.length;
  }

  /**
   * Creates an instance of SortedMap.
   *
   * @param iterable Iterable of elements to create the new map with.
   * @param compare Comparison function for elements sorting. Elements are compared as numbers by default.
   */
  constructor(iterable: Iterable<[K, V]> = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    this.arr = [];
    for (const entry of iterable) this.set(...entry);
  }

  /**
   * Clears the map.
   */
  clear() {
    this.arr = [];
  }

  /**
   * Deletes element from the map by key.
   *
   * @param key Element key.
   * @returns TRUE if element existed and has been removed, FALSE otherwise.
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
   * Finds the leftmost element with key greater than or equal to the specified key.
   *
   * @protected
   * @param key Element key.
   * @returns Element index and exact match result. Index equals to the map size if no key greater than the specified.
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
   * Finds the leftmost element with key greater than the specified key.
   *
   * @param key Element key.
   * @returns Key, value pair or undefined if key is the greatest or the map is empty.
   */
  findGreater(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);

    return exact ? this.arr[index] : this.arr[index + 1];
  }

  /**
   * Finds the leftmost element with key greater than or equal to the specified key.
   *
   * @param key Element key.
   * @returns Key, value pair or undefined if key is the greatest or the map is empty.
   */
  findGreaterOrEqual(key: K): [K, V] | undefined {
    return this.arr[this.findIndex(key).index];
  }

  /**
   * Finds the rightmost element with key less than the specified key.
   *
   * @param key Element key.
   * @returns Key, value pair or undefined if key is the smallest or the map is empty.
   */
  findLess(key: K): [K, V] | undefined {
    return this.arr[this.findIndex(key).index - 1];
  }

  /**
   * Finds the rightmost element with key less than or equal to the specified key.
   *
   * @param key Element key.
   * @returns Key, value pair or undefined if key is the smallest or the map is empty.
   */
  findLessOrEqual(key: K): [K, V] | undefined {
    const { index, exact } = this.findIndex(key);

    return exact ? this.arr[index] : this.arr[index - 1];
  }

  /**
   * Finds the greatest (by key) element in the map.
   *
   * @returns Key, value pair or undefined if the map is empty.
   */
  findMax(): [K, V] | undefined {
    return this.arr[this.size - 1];
  }

  /**
   * Finds the smallest (by key) element in the map.
   *
   * @returns Key, value pair or undefined if the map is empty.
   */
  findMin(): [K, V] | undefined {
    return this.arr[0];
  }

  /**
   * Returns an iterable of key, value pairs for every element in the map with start <= key < stop.
   *
   * @param start Element key to start from.
   * @param stop Element key to stop on.
   * @returns Iterable of key, value pairs.
   */
  findRange(start: K, stop: K): IterableIterator<[K, V]> {
    let current = this.findIndex(start).index;

    return {
      *[Symbol.iterator]() {
        // TODO: problem with types here
      },
      next: () => ({
        done: this.compare(this.arr[current][0], stop) !== ComparisonResult.LESS,
        value: this.arr[current++],
      }),
    };
  }

  /**
   * Executes a provided function once per each key/value pair in the Map
   *
   * @param callbackfn A function that accepts up to three arguments.
   * forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
    this.arr.forEach((value: [K, V]) => callbackfn(value[1], value[0], this), thisArg);
  }

  /**
   * Gets element from the map by key. Throws an error if key not found.
   *
   * @param key Element key.
   * @returns Element value.
   */
  get(key: K): V {
    const { index, exact } = this.findIndex(key);

    if (!exact) throw new Error('Key not found');

    return this.arr[index][1];
  }

  /**
   * Checks element presence in the map by key.
   *
   * @param key Element key.
   * @returns TRUE if element exists, FALSE otherwise.
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

    return {
      *[Symbol.iterator]() {
        // TODO: problem with types here
      },
      next: () => ({ done: current < this.size, value: this.arr[current++][0] }),
    };
  }

  /**
   * Returns an iterable of key, value pairs for every element in the map in reverse order.
   *
   * @returns Iterable of key, value pairs.
   */
  reversed(): IterableIterator<[K, V]> {
    let current = this.size - 1;

    return {
      *[Symbol.iterator]() {
        // TODO: problem with types here
      },
      next: () => ({ done: current > 0, value: this.arr[current--] }),
    };
  }

  /**
   * Sets element in the map by key.
   *
   * @param key Element key.
   * @param value Element value.
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

    return {
      *[Symbol.iterator]() {
        // TODO: problem with types here
      },
      next: () => ({ done: current < this.size, value: this.arr[current++][1] }),
    };
  }

  *[Symbol.iterator](): Generator<[K, V]> {
    for (const entry of this.entries()) yield entry;
  }

}
