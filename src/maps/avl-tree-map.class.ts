import { IComparator, compareAsStrings } from '../comparators';
import { ISortedMap } from './sorted-map.interface';
import { Node } from '../trees/linked-binary-tree.class';
import { Position } from '../position.class';
import { RelinkableBinaryTree } from '../trees/relinkable-binary.tree.class';
import { TreeMap } from './tree-map.class';

type P<K, V> = Position<[K, V], Node<[K, V]>>;

/**
 * Sorted map based on an AVL binary tree structure.
 */
export class AVLTreeMap<K, V> extends TreeMap<K, V, RelinkableBinaryTree<[K, V]>> implements ISortedMap<K, V> {

  get [Symbol.toStringTag](): string {
    return 'AVLTreeMap';
  }

  /**
   * Creates an instance of AVLTreeMap.
   *
   * @param iterable Iterable of pairs to create the new map with.
   * @param compare Comparison function for key-value pairs sorting by key. Keys are compared as strings by default.
   */
  constructor(iterable: Iterable<[K, V]> = [], compare: IComparator<K> = compareAsStrings) {
    super(new RelinkableBinaryTree(), compare);
    for (const pair of iterable) this.set(...pair);
  }

  protected rebalanceOnAdd(position: P<K, V>) {
    this.rebalance(position);
  }

  protected rebalanceOnGet() {
    // Not implemented for AVLTreeMap.
  }

  protected rebalanceOnRemove(position?: P<K, V>) {
    if (position) this.rebalance(position);
  }

  /**
   * Get node height of a specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Node height.
   */
  protected getHeight(position?: P<K, V>): number {
    if (!position) return 0;

    const meta = position._internal.node.meta;

    if (!meta) return 1;

    return meta.height;
  }

  /**
   * Gets child of the specified position with the greatest node height.
   *
   * @protected
   * @param position Position in the tree.
   * @param preferRight Prefer right child if heights are equal.
   * @returns Position of the tallest child or undefined no children.
   */
  protected getTallestChild(position: P<K, V>, preferRight = false): P<K, V> | undefined {
    const leftChild = this.tree.getLeft(position);
    const rightChild = this.tree.getRight(position);
    const leftHeight = this.getHeight(leftChild);
    const rightHeight = this.getHeight(rightChild);

    return leftHeight < rightHeight || leftHeight === rightHeight && preferRight ? rightChild : leftChild;
  }

  /**
   * Checks whether tree node at the specified position is unbalanced.
   *
   * @protected
   * @param position in the tree.
   * @returns TRUE if position is unbalanced, FALSE otherwise.
   */
  protected isUnbalanced(position: P<K, V>): boolean {
    return Math.abs(this.getHeight(this.tree.getLeft(position)) - this.getHeight(this.tree.getRight(position))) > 1;
  }

  /**
   * Performs traversing to the root starting from the specified position
   * applying restructuring operation where needed.
   *
   * @protected
   * @param position Position in the tree.
   */
  protected rebalance(position: P<K, V>) {
    let walk: P<K, V> | undefined = position;

    while (walk) {
      if (this.isUnbalanced(walk)) {
        const tallestChild = this.getTallestChild(walk) as P<K, V>;

        walk = this.tree.restructure(this.getTallestChild(tallestChild, this.tree.hasRight(walk) &&
          this.tree.areEqual(tallestChild, this.tree.getRight(walk) as P<K, V>)) as P<K, V>);
        for (const child of this.tree.getChildren(walk)) this.recalculateHeight(child);
      }

      if (!this.recalculateHeight(walk)) break;
      walk = this.tree.getParent(walk);
    }
  }

  /**
   * Recalculate and update node height at the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns TRUE if height has changed, FALSE otherwise.
   */
  protected recalculateHeight(position: P<K, V>): boolean {
    const node = position._internal.node;
    const tallestChildHeight = Math.max(
      this.getHeight(this.tree.getLeft(position)),
      this.getHeight(this.tree.getRight(position)),
    );

    if (!node.meta) {
      if (!tallestChildHeight) return true;

      node.meta = {};
    }

    return node.meta.height !== (node.meta.height = tallestChildHeight + 1);
  }

}
