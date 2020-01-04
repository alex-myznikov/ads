import { compareAsNumbers, CompareFunc } from '../comparators';
import { ISortedMap } from './sorted-map.interface';
import { Node } from '../trees/linked-binary-tree.class';
import { Position } from '../position.class';
import { RelinkableBinaryTree } from '../trees/relinkable-binary.tree.class';
import { TreeMap } from './tree-map.class';

type P<K, V> = Position<[K, V], Node<[K, V]>>;

/**
 * Implementation of a red-black tree map.
 */
export class RedBlackTreeMap<K, V> extends TreeMap<K, V, RelinkableBinaryTree<[K, V]>> implements ISortedMap<K, V> {

  get [Symbol.toStringTag](): string {
    return 'RedBlackTreeMap';
  }

  /**
   * Creates an instance of RedBlackTreeMap.
   *
   * @param iterable Iterable of pairs to create the new map with.
   * @param compare Comparison function for key-value pairs sorting by key. Keys are compared as numbers by default.
   */
  constructor(iterable: Iterable<[K, V]> = [], compare: CompareFunc<K> = compareAsNumbers) {
    super(new RelinkableBinaryTree(), compare);
    for (const pair of iterable) this.set(...pair);
  }

  protected rebalanceOnAdd(position: P<K, V>) {
    const parent = this.tree.getParent(position);

    if (!parent) return this.setColor(position, 'black');
    else if (this.getColor(parent) === 'red') {
      const sibling = this.tree.getSibling(parent);

      if (!sibling || this.getColor(sibling) === 'black') {
        const subroot = this.tree.restructure(position);

        this.setColor(subroot, 'black');
        this.setColor(this.tree.getLeft(subroot) as P<K, V>, 'red');
        this.setColor(this.tree.getRight(subroot) as P<K, V>, 'red');
      } else {
        const grandParent = this.tree.getParent(parent) as P<K, V>;

        this.setColor(grandParent, 'red');
        this.setColor(parent, 'black');
        this.setColor(sibling, 'black');
        this.rebalanceOnAdd(grandParent);
      }
    }
  }

  protected rebalanceOnGet() {
    // Not implemented for RedBlackTreeMap.
  }

  protected rebalanceOnRemove(position?: P<K, V>) {
    if (this.size === 1) this.setColor(this.tree.getRoot() as P<K, V>, 'black');
    else if (!position) return;
    else {
      const numChildren = this.tree.getNumChildren(position);

      if (numChildren === 1) {
        const child = this.tree.getChildren(position).next().value as P<K, V>;

        if (this.getColor(child) === 'black' || !this.tree.isLeaf(child)) this.fixDeficit(position, child);
      } else if (numChildren === 2) {
        const leftChild = this.tree.getLeft(position) as P<K, V>;

        if (this.getColor(leftChild) === 'red' && this.tree.isLeaf(leftChild)) this.setColor(leftChild, 'black');
        else this.setColor(this.tree.getRight(position) as P<K, V>, 'black');
      }
    }
  }

  /**
   * Resolve black deficit at the specified position.
   *
   * @protected
   * @param position Position to fix deficit on.
   * @param child Child of the position which is root in the subtree of bigger depth.
   */
  protected fixDeficit(position: P<K, V>, child: P<K, V>) {
    if (this.getColor(child) === 'red') {
      this.tree.rotate(child);
      this.setColor(child, 'black');
      this.setColor(position, 'red');
      if (this.tree.areEqual(position, this.tree.getRight(child) as P<K, V>))
        this.fixDeficit(position, this.tree.getLeft(position) as P<K, V>);
      else this.fixDeficit(position, this.tree.getRight(position) as P<K, V>);
    } else {
      const redChild = this.getRedChild(child);

      if (redChild) {
        const color = this.getColor(position);
        const subroot = this.tree.restructure(redChild);

        this.setColor(subroot, color);
        this.setColor(this.tree.getLeft(subroot) as P<K, V>, 'black');
        this.setColor(this.tree.getRight(subroot) as P<K, V>, 'black');
      } else {
        this.setColor(child, 'red');
        if (this.getColor(position) === 'red') this.setColor(position, 'black');
        else if (!this.tree.isRoot(position))
          this.fixDeficit(this.tree.getParent(position) as P<K, V>, this.tree.getSibling(position) as P<K, V>);
      }
    }
  }

  /**
   * Get color to a node of the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Red or black node color.
   */
  protected getColor(position: P<K, V>): 'red' | 'black' {
    const meta = position._internal.node.meta;

    if (meta && meta.black) return 'black';

    return 'red';
  }

  /**
   * Gets red child of the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Position of the red child.
   */
  protected getRedChild(position: P<K, V>): P<K, V> | undefined {
    for (const child of this.tree.getChildren(position)) if (this.getColor(child) === 'red') return child;
  }

  /**
   * Set color to a node of the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @param color Red or black node color.
   */
  protected setColor(position: P<K, V>, color: 'red' | 'black') {
    const node = position._internal.node;

    if (!node.meta) node.meta = {};
    node.meta.black = color === 'black';
  }

}
