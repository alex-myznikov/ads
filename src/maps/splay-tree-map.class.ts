import { compareAsNumbers, CompareFunc } from '../comparators';
import { ISortedMap } from './sorted-map.interface';
import { Node } from '../trees/linked-binary-tree.class';
import { Position } from '../position.class';
import { RelinkableBinaryTree } from '../trees/relinkable-binary.tree.class';
import { TreeMap } from './tree-map.class';

type P<K, V> = Position<[K, V], Node<[K, V]>>;

/**
 * Sorted map based on a splay binary tree structure.
 */
export class SplayTreeMap<K, V> extends TreeMap<K, V, RelinkableBinaryTree<[K, V]>> implements ISortedMap<K, V> {

  get [Symbol.toStringTag](): string {
    return 'SplayTreeMap';
  }

  /**
   * Creates an instance of SplayTreeMap.
   *
   * @param iterable Iterable of pairs to create the new map with.
   * @param compare Comparison function for key-value pairs sorting by key. Keys are compared as numbers by default.
   */
  constructor(iterable: Iterable<[K, V]> = [], compare: CompareFunc<K> = compareAsNumbers) {
    super(new RelinkableBinaryTree(), compare);
    for (const pair of iterable) this.set(...pair);
  }

  protected rebalanceOnAdd(position: P<K, V>) {
    this.splay(position);
  }

  protected rebalanceOnGet(position: P<K, V>) {
    this.splay(position);
  }

  protected rebalanceOnRemove(position?: P<K, V>) {
    if (position) this.splay(position);
  }

  /**
   * Performs splaying of the specified position to the root
   * applying restructuring and rotation where needed.
   *
   * @protected
   * @param position Position in the tree.
   */
  protected splay(position: P<K, V>) {
    let parent = this.tree.getParent(position);

    while (parent) {
      if (this.tree.isRoot(parent)) this.tree.rotate(position);
      else if (this.tree.areEqual(parent, this.tree.restructure(position))) this.tree.rotate(position);
      parent = this.tree.getParent(position);
    }
  }

}
