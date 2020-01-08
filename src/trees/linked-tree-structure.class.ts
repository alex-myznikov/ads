import { ADSError } from '../errors';
import { IContainer } from '../container.interface';
import { IStructure } from '../structure.interface';
import { Position } from '../position.class';

/**
 * Provides implementation of the common behaviour for linked trees.
 */
export class LinkedTreeStructure<T, N extends IContainer<T>> implements IStructure {

  /**
   * Root node of the tree.
   */
  root?: N;

  /**
   * Number of nodes in the tree.
   */
  size: number;

  get length(): number {
    return this.size;
  }

  /**
   * Creates an instance of LinkedTreeStructure.
   *
   * @param isDeprecated Checks whether the specified tree node is deprecated.
   * Deprecated node is not a part of the tree and must be deleted.
   */
  constructor(protected isDeprecated: (node: N) => boolean) {
    this.size = 0;
  }

  clear() {
    delete this.root;
    this.size = 0;
  }

  /**
   * Creates an instance of position referring to the specified tree node.
   *
   * @protected
   * @param node Instance of a node from the tree.
   * @returns Position of the node.
   */
  createPosition(node: N): Position<T, N> {
    return new Position(node, this);
  }

  /**
   * Checks whether the tree is empty or not.
   *
   * @returns TRUE if the tree is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return !this.size;
  }

  /**
   * Ensures the specified position is valid and belongs to this tree. Throws an error if validation fails.
   *
   * @protected
   * @param position Position of a node in the tree.
   * @returns Node the position is referring to.
   */
  validate(position: Position<T, N>): N {
    const { node, container } = position._internal;

    if (container !== this) throw new ADSError('Position does not belong to this tree');
    else if (this.isDeprecated(node)) throw new ADSError('Position is deprecated');

    return node;
  }

}
