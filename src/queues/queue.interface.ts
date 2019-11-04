/**
 * Interface of a queue (FIFO) data structure.
 */
export interface IQueue<T> {

  /**
   * Number of elements in the queue.
   *
   * @readonly
   */
  length: number;

  /**
   * Clears the queue.
   */
  clear(): void;

  /**
   * Checks whether the queue is empty or not.
   *
   * @returns TRUE if the queue is empty, FALSE otherwise.
   */
  isEmpty(): boolean;

  /**
   * Removes the first element from the front of the queue and returns it. Throws an error if the queue is empty.
   *
   * @returns Removed element.
   */
  dequeue(): T;

  /**
   * Adds element at the rear of the queue.
   *
   * @param element Element to add.
   */
  enqueue(element: T): void;

  /**
   * Gets element from the front of the queue without its removal.
   *
   * @returns Queue element.
   */
  first(): T;

}
