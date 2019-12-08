import { IStructure } from '../structure.interface';

/**
 * An abstract queue (FIFO) data structure.
 */
export abstract class QueueAbstract<T, S extends IStructure> implements IStructure {

  /**
   * Number of elements in the queue.
   *
   * @readonly
   */
  get length(): number {
    return this.structure.length;
  }

  /**
   * Creates an instance of QueueAbstract.
   *
   * @param structure Data structure.
   */
  constructor(protected structure: S) { }

  /**
   * Clears the queue.
   */
  clear() {
    this.structure.clear();
  }

  /**
   * Checks whether the queue is empty or not.
   *
   * @returns TRUE if the queue is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return this.structure.isEmpty();
  }

  /**
   * Removes the first element from the front of the queue and returns it. Throws an error if the queue is empty.
   *
   * @returns Removed element.
   */
  abstract dequeue(): T;

  /**
   * Adds element at the rear of the queue.
   *
   * @param element Element to add.
   */
  abstract enqueue(element: T): void;

  /**
   * Gets element from the front of the queue without its removal.
   *
   * @returns Queue element.
   */
  abstract getFirst(): T;

}
