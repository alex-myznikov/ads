import { IContainer } from '../container.interface';
import { IStructure } from '../structure.interface';
import { TreeTraversalAbstract, ITraversalMetadata } from './traversal.class';

/**
 * Extracts position type from the specified tree type.
 */
export type ExtractPosition<TR> = TR extends TreeAbstract<any, infer P, any> ? P : never;

/**
 * An abstract tree.
 */
export abstract class TreeAbstract<T, P extends IContainer<T> = IContainer<T>,
  S extends IStructure = IStructure> implements IStructure {

  /**
   * Number of elements in the tree.
   *
   * @readonly
   */
  get length(): number {
    return this.structure.length;
  }

  /**
   * Creates an instance of TreeAbstract.
   *
   * @param structure Data structure.
   */
  constructor(protected structure: S) { }

  /**
   * Checks whether the specified positions are of the same element.
   *
   * @param a Position in the tree.
   * @param b Position in the tree.
   * @returns TRUE if the positions are the same, FALSE otherwise.
   */
  abstract areEqual(a: P, b: P): boolean;

  /**
   * Clears the tree.
   */
  clear() {
    this.structure.clear();
  }

  /**
   * Gets iteration of children of the specified position in the tree.
   *
   * @param position Position in the tree.
   * @returns Iterable iterator of positions.
   */
  abstract getChildren(position: P): IterableIterator<P>;

  /**
   * Gets number of levels separating the specified position from the root.
   *
   * @param position Position in the tree. No position to get the depth of the tree.
   * @returns Number of levels.
   */
  getDepth(position: P): number {
    return this.isRoot(position) ? 0 : 1 + this.getDepth(this.getParent(position) as P);
  }

  /**
   * Gets the maximum number of levels separating the specified position from the tree's leaves.
   *
   * @param position Position in the tree. No position to get the height of the tree.
   * @returns Number of levels.
   */
  getHeight(position?: P): number {
    if (!position) return this.structure.isEmpty() ? 0 : this.getHeight(this.getRoot());
    else if (this.isLeaf(position)) return 0;

    let maxHeight = 0;

    for (const pos of this.getChildren(position)) maxHeight = Math.max(maxHeight, this.getHeight(pos));

    return 1 + maxHeight;
  }

  /**
   * Gets count of children of the specified position in the tree.
   *
   * @param position Position in the tree.
   * @returns Number of children. Zero if position is of a leaf element.
   */
  abstract getNumChildren(position: P): number;

  /**
   * Gets parent of the specified position in the tree.
   *
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position is of the root.
   */
  abstract getParent(position: P): P | undefined;

  /**
   * Gets position of the root element of the tree.
   *
   * @returns Position of the root element.
   */
  abstract getRoot(): P | undefined;

  /**
   * Checks whether the tree is empty or not.
   *
   * @returns TRUE if the tree is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return this.structure.isEmpty();
  }

  /**
   * Checks whether the specified position is of a leaf element in the tree.
   *
   * @param position Position in the tree.
   * @returns TRUE if the position's element is leaf, FALSE otherwise.
   */
  isLeaf(position: P): boolean {
    return !this.getNumChildren(position);
  }

  /**
   * Checks whether the specified position is of the root element in the tree.
   *
   * @param position Position in the tree.
   * @returns TRUE if the position's element is root, FALSE otherwise.
   */
  abstract isRoot(position: P): boolean;

  /**
   * Accepts traversal to traverse through the elements of the tree.
   *
   * @param traversal Tree traversal algorithm.
   */
  abstract traverse<R, M extends ITraversalMetadata>(traversal: TreeTraversalAbstract<T, R, this, M>): R;

}
