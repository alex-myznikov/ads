import { IContainer } from '../container.interface';
import { IStructure } from '../queues';
import { TreeAbstract } from './tree.class';

export type ExtractPosition<TR> = TR extends TreeAbstract<any, infer P, any> ? P : never;

/**
 * Metadata interface for current traversal step.
 */
export interface ITraversalMetadata {

  /**
   * Index of currently visited element in traversal.
   */
   index: number;

}

/**
 * Interface for accessing tree elements during traversal.
 */
export interface ITreeTraversable<T, TR extends TreeAbstract<T, IContainer<T>, IStructure>> {

  /**
   * Currently visited element of the tree.
   */
  element: T;

  /**
   * Gets position of the visited element in the tree.
   */
  getPosition(): ExtractPosition<TR>;

  /**
   * Index number of the visited element in this traversal.
   */
  index: number;

  /**
   * The tree this traversal goes on.
   */
  tree: TR;

}

/**
 * Interface for accessing general tree elements during traversal.
 */
export interface IGeneralTreeTraversable<T, TR extends TreeAbstract<T, IContainer<T>, IStructure>>
  extends ITreeTraversable<T, TR> {

  /**
   * Gets iteration of children traversables of the currently visited element.
   */
  getChildren(): IterableIterator<IGeneralTreeTraversable<T, TR>>;
}

/**
 * Interface for accessing binary tree elements during traversal.
 */
export interface IBinaryTreeTraversable<T, TR extends TreeAbstract<T, IContainer<T>, IStructure>>
  extends ITreeTraversable<T, TR> {

  /**
   * Traversable of the left child of the currently visited element.
   */
  getLeft(): IBinaryTreeTraversable<T, TR> | undefined;

  /**
   * Traversable of the right child of the currently visited element.
   */
  getRight(): IBinaryTreeTraversable<T, TR> | undefined;
}

/**
 * An abstract implementation of a tree traversal.
 */
export abstract class TreeTraversalAbstract<T, R, TR extends TreeAbstract<T, IContainer<T>, IStructure>,
  M extends ITraversalMetadata = ITraversalMetadata> {

  /**
   * Creates an instance of TreeTraversalAbstract.
   *
   * @param callback Function to call on each visited element during traversal.
   */
  constructor(protected callback: (
    element: T,
    meta: M,
    getPosition: () => ExtractPosition<TR>,
    tree: TR,
  ) => R) { }

  /**
   * Traverses through a binary tree applying callback to each visited element.
   *
   * @param traversable Traversable representation of an element of the tree.
   */
  abstract traverseBinary(traversable: IBinaryTreeTraversable<T, TR>): R;

  /**
   * Traverses through a general tree applying callback to each visited element.
   *
   * @param traversable Traversable representation of an element of the tree.
   */
  abstract traverseGeneral(traversable: IGeneralTreeTraversable<T, TR>): R;

}
