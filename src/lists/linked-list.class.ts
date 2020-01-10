import { IContainer } from '../container.interface';
import { IStructure } from '../structure.interface';

/**
 * An abstract iterable linked chain of elements.
 */
export abstract class LinkedListAbstract<T, N extends IContainer<T>> implements IStructure {

  /**
   * Head node of the list.
   *
   * @protected
   */
  protected head?: N;

  /**
   * Number of nodes in the list.
   *
   * @protected
   */
  protected size: number;

  /**
   * Tail node of the list.
   *
   * @protected
   */
  protected tail?: N;

  /**
   * Number of elements in the list.
   *
   * @readonly
   */
  get length(): number {
    return this.size;
  }

  constructor() {
    this.size = 0;
  }

  /**
   * Clears the list.
   */
  abstract clear(): void;

  /**
   * Checks whether the list is empty or not.
   *
   * @returns TRUE if the list is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return !this.size;
  }

  abstract [Symbol.iterator](): IterableIterator<T>;

}
