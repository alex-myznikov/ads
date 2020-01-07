import { ADSError } from '../ads-error.class';
import { IContainer } from '../container.interface';
import { LinkedListAbstract } from './linked-list.class';
import { Position } from '../position.class';

/**
 * An abstract chain of elements allowing access by position.
 */
export abstract class PositionalListAbstract<T, N extends IContainer<T>> extends LinkedListAbstract<T, N> {

  /**
   * Clears the list. If instant set TRUE it takes O(1) time but does not deprecate existing positions.
   *
   * @param instant TRUE to deprecate all existing positions, FALSE to skip deprecation (client code cares of it).
   */
  abstract clear(instant?: boolean): void;

  /**
   * Creates an instance of position referring to the specified list node.
   *
   * @protected
   * @param node Instance of a node from the list.
   * @returns Position of the node.
   */
  protected createPosition(node: N): Position<T, N> {
    return new Position(node, this);
  }

  /**
   * Checks whether the specified list node is deprecated.
   * Deprecated node is not a part of the list and must be deleted.
   *
   * @protected
   * @param node Instance of a node from the list.
   * @returns TRUE if the node is deprecated, FALSE otherwise.
   */
  protected abstract isDeprecated(node: N): boolean;

  /**
   * Ensures the specified position is valid and belongs to this list. Throws an error if validation fails.
   *
   * @protected
   * @param position Position of a node in the list.
   * @returns Node the position is referring to.
   */
  protected validate(position: Position<T, N>): N {
    const { node, container } = position._internal;

    if (container !== this) throw new ADSError('Position does not belong to this list');
    else if (this.isDeprecated(node)) throw new ADSError('Position is deprecated');

    return node;
  }

}
