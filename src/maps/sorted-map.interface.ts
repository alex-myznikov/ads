/**
 * Interface of a sorted map.
 */
export interface ISortedMap<K, V> extends Map<K, V> {

  /**
   * Finds the leftmost key-value pair with key greater than the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the greatest or the map is empty.
   */
  findGreater(key: K): [K, V] | undefined;

  /**
   * Finds the leftmost key-value pair with key greater than or equal to the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the greatest or the map is empty.
   */
  findGreaterOrEqual(key: K): [K, V] | undefined;

  /**
   * Finds the rightmost key-value pair with key less than the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the smallest or the map is empty.
   */
  findLess(key: K): [K, V] | undefined;

  /**
   * Finds the rightmost key-value pair with key less than or equal to the specified key.
   *
   * @param key Pair key.
   * @returns Key-value pair or undefined if key is the smallest or the map is empty.
   */
  findLessOrEqual(key: K): [K, V] | undefined;

  /**
   * Finds the greatest (by key) key-value pair in the map.
   *
   * @returns Key-value pair or undefined if the map is empty.
   */
  findMax(): [K, V] | undefined;

  /**
   * Finds the smallest (by key) key-value pair in the map.
   *
   * @returns Key-value pair or undefined if the map is empty.
   */
  findMin(): [K, V] | undefined;

  /**
   * Returns an iterable of key-value pairs for every pair in the map with start <= key < stop.
   *
   * @param start Pair key to start from.
   * @param stop Pair key to stop on.
   * @returns Iterable iterator of key-value pairs.
   */
  findRange(start: K, stop: K): IterableIterator<[K, V]>;

  /**
   * Checks whether the map is empty or not.
   *
   * @returns TRUE if the map is empty, FALSE otherwise.
   */
  isEmpty(): boolean;

  /**
   * Returns an iterable of key-value pairs for every key-value pair in the map in reverse order.
   *
   * @returns Iterable iterator of key-value pairs.
   */
  reversed(): IterableIterator<[K, V]>;

}
