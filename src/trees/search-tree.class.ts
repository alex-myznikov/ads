import { BinaryTree } from './binary-tree.class';
import { CompareFunc, ComparisonResult } from '../comparators';
import { ExtractPosition } from './tree.class';

type E<TR> = ExtractPosition<TR>;

/**
 * An abstract search tree.
 */
export abstract class SearchTreeAbstract<T, K = T, TR extends BinaryTree<T> = BinaryTree<T>> {

  /**
   * Creates an instance of SearchTreeAbstract.
   *
   * @param tree Binary tree.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(protected tree: TR, protected compare: CompareFunc<T, K>) { }

  /**
   * Performs rebalancing of the tree after adding a new element.
   *
   * @protected
   * @param position Position of the added element.
   */
  protected abstract rebalanceOnAdd(position: E<TR>): void;

  /**
   * Performs rebalancing of the tree after accessing its element.
   *
   * @protected
   * @param position Position of the accessed element.
   */
  protected abstract rebalanceOnGet(position: E<TR>): void;

  /**
   * Performs rebalancing of the tree after removing one of its element.
   *
   * @protected
   * @param position Position of the parent of the removed element. Undefined if removed position was root.
   */
  protected abstract rebalanceOnRemove(position?: E<TR>): void;

  /**
   * Gets position after the specified position in the tree.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position is the last.
   */
  protected getAfter(position: E<TR>): E<TR> | undefined {
    if (this.tree.hasRight(position)) return this.getFirst(this.tree.getRight(position) as E<TR>);

    let parent = this.tree.getParent(position) as E<TR> | undefined;
    let walk = position;

    while (parent && this.tree.isRightChild(walk, parent)) {
      walk = parent;
      parent = this.tree.getParent(walk) as E<TR>;
    }

    return parent;
  }

  /**
   * Gets position before the specified position in the tree.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position is the first.
   */
  protected getBefore(position: E<TR>): E<TR> | undefined {
    if (this.tree.hasLeft(position)) return this.getLast(this.tree.getLeft(position) as E<TR>);

    let parent = this.tree.getParent(position) as E<TR> | undefined;
    let walk = position;

    while (parent && this.tree.hasLeft(parent) &&
      this.tree.areEqual(walk, this.tree.getLeft(parent) as E<TR>)) {
      walk = parent;
      parent = this.tree.getParent(walk) as E<TR>;
    }

    return parent;
  }

  /**
   * Gets position of the first element in subtree rooted at the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Position of the first element. Undefined if the subtree root is undefined.
   */
  protected getFirst(position = this.tree.getRoot() as E<TR> | undefined): E<TR> | undefined {
    let walk = position;

    if (!walk) return;
    while (this.tree.hasLeft(walk)) walk = this.tree.getLeft(walk) as E<TR>;

    return walk;
  }

  /**
   * Gets position of the last element in subtree rooted at the specified position.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Position of the last element. Undefined if the subtree root is undefined.
   */
  protected getLast(position = this.tree.getRoot() as E<TR> | undefined): E<TR> | undefined {
    let walk = position;

    if (!walk) return;
    while (this.tree.hasRight(walk)) walk = this.tree.getRight(walk) as E<TR>;

    return walk;
  }

  /**
   * Iterates through the subtree rooted at the specified position.
   *
   * @protected
   * @param next Next position retriever function.
   * @param position Position in the tree.
   * @returns Iterable iterator of positions. An empty iterator if the subtree is empty.
   */
  protected iterate(
    next: (current: E<TR>) => E<TR> | undefined,
    position = this.getFirst(),
  ): IterableIterator<E<TR>> {
    let current = position;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next: () => {
        let result: {
          done: true,
          value: E<TR> | undefined,
        } | {
          done: false,
          value: E<TR>,
        };

        if (!current) result = { done: true, value: current };
        else {
          result = { done: false, value: current };
          current = next(current);
        }

        return result;
      },
    };

    return iterator;
  }

  /**
   * Finds element position within the subtree rooted at the specified position.
   *
   * @protected
   * @param query Query to look up for. May be of any type recognizable by the comparison function.
   * @param position Position in the tree to start searching from.
   * @returns Position of the element matching the search or of the last element searched.
   * Undefined if the subtree is empty.
   */
  protected search(query: K, position = this.tree.getRoot() as E<TR> | undefined): E<TR> | undefined {
    if (!position) return;

    switch (this.compare(position.element, query)) {
      case ComparisonResult.LESS:
        return this.tree.hasRight(position) ?
          this.search(query, this.tree.getRight(position) as E<TR>) : position;
      case ComparisonResult.GREATER:
        return this.tree.hasLeft(position) ?
          this.search(query, this.tree.getLeft(position) as E<TR>) : position;
      default:
        return position;
    }
  }

}
