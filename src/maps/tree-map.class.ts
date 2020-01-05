import { BinaryTree } from '../trees/binary-tree.class';
import { CompareFunc, ComparisonResult } from '../comparators';
import { ExtractPosition } from '../trees/tree.class';
import { InorderTreeTraversal } from '../trees';
import { ISortedMap } from './sorted-map.interface';
import { SearchTreeAbstract } from '../trees/search-tree.class';

type E<TR> = ExtractPosition<TR>;

/**
 * An abstract tree map.
 */
export abstract class TreeMap<K, V, TR extends BinaryTree<[K, V]> = BinaryTree<[K, V]>>
  extends SearchTreeAbstract<[K, V], K, TR> implements ISortedMap<K, V> {

  get size() {
    return this.tree.length;
  }

  /**
   * Creates an instance of TreeMap.
   *
   * @param tree Binary tree.
   * @param compare Comparison function for key-value pairs sorting by key. Keys are compared as numbers by default.
   */
  constructor(protected tree: TR, compare: CompareFunc<K>) {
    super(tree, (a: [K, V], b: K) => compare(a[0], b));
  }

  abstract get [Symbol.toStringTag](): string;

  clear() {
    this.tree.clear();
  }

  delete(key: K): boolean {
    const position = this.search(key);
    let parent: E<TR> | undefined;

    if (!position || this.compare(position.element, key) !== ComparisonResult.EQUAL) return false;
    else if (this.tree.getNumChildren(position) > 1) {
      const before = this.getBefore(position) as E<TR>;
      const [k, v] = before.element;

      before.element[0] = position.element[0];
      before.element[1] = position.element[1];
      position.element[0] = k;
      position.element[1] = v;
      parent = this.tree.getParent(before) as E<TR>;
      this.tree.remove(before);
    } else {
      parent = this.tree.getParent(position) as E<TR> | undefined;
      this.tree.remove(position);
    }

    this.rebalanceOnRemove(parent);

    return true;
  }

  *entries(): IterableIterator<[K, V]> {
    for (const position of this.iterate(current => this.getAfter(current)))
      yield [position.element[0], position.element[1]];
  }

  findGreater(key: K): [K, V] | undefined {
    let position = this.search(key);

    if (!position) return;
    else if (this.compare(position.element, key) !== ComparisonResult.GREATER) position = this.getAfter(position);

    return position ? [position.element[0], position.element[1]] : position;
  }

  findGreaterOrEqual(key: K): [K, V] | undefined {
    let position = this.search(key);

    if (!position) return;
    else if (this.compare(position.element, key) === ComparisonResult.LESS) position = this.getAfter(position);

    return position ? [position.element[0], position.element[1]] : position;
  }

  findLess(key: K): [K, V] | undefined {
    let position = this.search(key);

    if (!position) return;
    if (this.compare(position.element, key) !== ComparisonResult.LESS) position = this.getBefore(position);

    return position ? [position.element[0], position.element[1]] : position;
  }

  findLessOrEqual(key: K): [K, V] | undefined {
    let position = this.search(key);

    if (!position) return;
    if (this.compare(position.element, key) === ComparisonResult.GREATER) position = this.getBefore(position);

    return position ? [position.element[0], position.element[1]] : position;
  }

  findMax(): [K, V] | undefined {
    const position = this.getLast(this.tree.getRoot() as E<TR>);

    return position ? [position.element[0], position.element[1]] : position;
  }

  findMin(): [K, V] | undefined {
    const position = this.getFirst(this.tree.getRoot() as E<TR>);

    return position ? [position.element[0], position.element[1]] : position;
  }

  *findRange(start: K, stop: K): IterableIterator<[K, V]> {
    const startPosition = this.search(start);

    if (!startPosition || this.compare(startPosition.element, stop) !== ComparisonResult.LESS) return;
    for (const position of this.iterate(
      current => {
        const next = this.getAfter(current);

        if (!next || this.compare(next.element, stop) !== ComparisonResult.LESS) return;

        return next;
      },
      startPosition,
    )) yield [position.element[0], position.element[1]];
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
    this.tree.traverse(new InorderTreeTraversal((value: [K, V]) => callbackfn.call(thisArg, value[1], value[0], this)));
  }

  get(key: K): V {
    const position = this.search(key);

    if (position) this.rebalanceOnGet(position);
    if (!position || this.compare(position.element, key) !== ComparisonResult.EQUAL) throw new Error('Key not found');

    return position.element[1];
  }

  has(key: K): boolean {
    const position = this.search(key);

    if (position) this.rebalanceOnGet(position);

    return !position || this.compare(position.element, key) !== ComparisonResult.EQUAL ? false : true;
  }

  isEmpty(): boolean {
    return !this.size;
  }

  *keys(): IterableIterator<K> {
    for (const position of this.iterate(current => this.getAfter(current))) yield position.element[0];
  }

  *reversed(): IterableIterator<[K, V]> {
    for (const position of this.iterate(
      current => this.getBefore(current),
      this.getLast(),
    )) yield [position.element[0], position.element[1]];
  }

  set(key: K, value: V): this {
    let position = this.search(key);

    if (!position) position = this.tree.addRoot([key, value]) as E<TR>;
    else if (this.compare(position.element, key) === ComparisonResult.LESS)
      position = this.tree.addRight(position, [key, value]) as E<TR>;
    else if (this.compare(position.element, key) === ComparisonResult.EQUAL) position.element[1] = value;
    else position = this.tree.addLeft(position, [key, value]) as E<TR>;
    this.rebalanceOnAdd(position);

    return this;
  }

  *values(): IterableIterator<V> {
    for (const position of this.iterate(current => this.getAfter(current))) yield position.element[1];
  }

  *[Symbol.iterator](): IterableIterator<[K, V]> {
    for (const entry of this.entries()) yield entry;
  }

}
