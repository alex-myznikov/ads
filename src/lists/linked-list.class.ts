import { IContainer } from 'src/container.interface';

/**
 * An abstract iterable chain of elements.
 */
export abstract class LinkedListAbstract<T, N extends IContainer<T>> {

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
  get length() {
    return this.size;
  }

  constructor() {
    this.size = 0;
  }

  /**
   * Checks whether the list is empty or not.
   *
   * @returns TRUE if the list is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return !this.size;
  }

  abstract [Symbol.iterator](): Generator<T>;

}
