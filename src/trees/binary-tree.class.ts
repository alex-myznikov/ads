import { IContainer } from '../container.interface';
import { IStructure } from '../queues';
import { TreeAbstract } from './tree.class';

/**
 * An abstract binary tree.
 */
export abstract class BinaryTree<T, P extends IContainer<T>, S extends IStructure> extends TreeAbstract<T, P, S> {

  /**
   * Adds element as the left child of the specified position. Throws an error if left child already exists.
   *
   * @param position Position in the tree.
   * @param element Element to add.
   * @returns Position of the added element.
   */
   abstract addLeft(position: P, element: T): P;

   /**
   * Adds element as the right child of the specified position. Throws an error if right child already exists.
   *
   * @param position Position in the tree.
   * @param element Element to add.
   * @returns Position of the added element.
   */
  abstract addRight(position: P, element: T): P;

  /**
   * Adds the specified element at the root of the tree. Throws an error if the tree is not empty.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  abstract addRoot(element: T): P;

  // attach(position: P, treeLeft?: this, treeRight?: this) { ... } TODO: realization and tests

  /**
   * Gets left child of the specified position.
   *
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position has no left child.
   */
   abstract getLeft(position: P): P | undefined;

  /**
   * Gets right child of the specified position.
   *
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position has no right child.
   */
  abstract getRight(position: P): P | undefined;

  /**
   * Gets sibling of the specified position.
   *
   * @param position Position in the tree.
   * @returns Position or undefined if the specified position has no sibling.
   */
  abstract getSibling(position: P): P | undefined;

  /**
   * Checks existence of a left child for the specified position.
   *
   * @param position Position in the tree.
   * @returns TRUE if position has left child, FALSE otherwise.
   */
  abstract hasLeft(position: P): boolean;

  /**
   * Checks existence of a right child for the specified position.
   *
   * @param position Position in the tree.
   * @returns TRUE if position has right child, FALSE otherwise.
   */
  abstract hasRight(position: P): boolean;

  /**
   * Checks existence of a sibling for the specified position.
   *
   * @param position Position in the tree.
   * @returns TRUE if position has sibling, FALSE otherwise.
   */
  abstract hasSibling(position: P): boolean;

  /**
   * Removes element from the tree by position and returns it. Throws an error if the position is not valid
   * or has more than one child.
   *
   * @param position Position of the element.
   * @returns Removed element.
   */
  abstract remove(position: P): T;

  /**
   * Replaces element at the specified position.
   *
   * @param position Position of an element.
   * @param element Element to replace the existing with.
   * @returns Replaced element.
   */
  abstract replace(position: P, element: T): T;

}
