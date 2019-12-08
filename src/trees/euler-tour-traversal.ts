import {
  ExtractPosition,
  IBinaryTreeTraversable,
  IGeneralTreeTraversable,
  ITraversalMetadata,
  TreeTraversalAbstract,
} from './traversal.class';
import { TreeAbstract } from './tree.class';

/**
 * Metadata interface for Euler Tour traversal step.
 */
export interface IEulerTourMetadata<T> extends ITraversalMetadata {

  /**
   * Depth of a currently visited element.
   */
  depth: number;

  /**
   * Path to currently visited element in the tree.
   */
  path: number[];

  /**
   * Current phase of traversal.
   */
  phase: 'pre' | 'in' | 'post';

  /**
   * Results of applying callback to children of currently visited element.
   */
  results: T[];

}

/**
 * Implementation of an Euler Tour tree traversal.
 */
export class EulerTourTreeTraversal<T, R = T, TR extends TreeAbstract<T> = TreeAbstract<T>>
  extends TreeTraversalAbstract<T, R, TR, IEulerTourMetadata<R>> {

  constructor(protected callback: (
    element: T,
    meta: IEulerTourMetadata<R>,
    getPosition: () => ExtractPosition<TR>,
    tree: TR,
  ) => R) {
    super(callback);
  }

  /**
   * Runs Euler Tour on a binary tree applying callback to each visited element.
   *
   * @private
   * @param traversable Traversable representation of an element of the tree.
   * @param meta Metadata of the current traversal step.
   * @returns Accumulated result of current traversal step.
   */
  private tourBinary(
    traversable: IBinaryTreeTraversable<T, TR>,
    meta: Omit<IEulerTourMetadata<R>, keyof ITraversalMetadata | 'phase'>,
  ): R {
    const { element, index, getPosition, tree } = traversable;
    const { depth, path, results } = meta;
    let child;

    this.callback(element, { index, phase: 'pre', depth, path, results }, getPosition, tree);
    child = traversable.getLeft();
    if (child) results[0] = this.tourBinary(child, { depth: depth + 1, path: [...path, 0], results: [] });
    this.callback(element, { index, phase: 'in', depth, path, results }, getPosition, tree);
    child = traversable.getRight();
    if (child) results[1] = this.tourBinary(child, { depth: depth + 1, path: [...path, 1], results: [] });

    return this.callback(element, { index, phase: 'post', depth, path, results }, getPosition, tree);
  }

  /**
   * Runs Euler Tour on a general tree applying callback to each visited element.
   *
   * @private
   * @param traversable Traversable representation of an element of the tree.
   * @param meta Metadata of the current traversal step.
   * @returns Accumulated result of current traversal step.
   */
  private tourGeneral(
    traversable: IGeneralTreeTraversable<T, TR>,
    meta: Omit<IEulerTourMetadata<R>, keyof ITraversalMetadata | 'phase'>,
  ): R {
    const { element, index, getPosition, tree } = traversable;
    const { depth, path, results } = meta;
    const childDepth = depth + 1;
    const childPath = [...path, 0];

    this.callback(element, { index, phase: 'pre', depth, path, results }, getPosition, tree);

    for (const child of traversable.getChildren()) {
      results.push(this.tourGeneral(child, { depth: childDepth, path: childPath, results: [] }));
      childPath[childPath.length - 1]++;
    }

    return this.callback(element, { index, phase: 'post', depth, path, results }, getPosition, tree);
  }

  traverseBinary(traversable: IBinaryTreeTraversable<T, TR>): R {
    return this.tourBinary(traversable, {
      depth: 0,
      path: [] as number[],
      results: [] as R[],
    });
  }

  traverseGeneral(traversable: IGeneralTreeTraversable<T, TR>): R {
    return this.tourGeneral(traversable, {
      depth: 0,
      path: [] as number[],
      results: [] as R[],
    });
  }

}
