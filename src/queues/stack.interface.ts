/**
 * Interface of a stack (LIFO) data structure.
 */
export interface IStack<T> {

  /**
   * Number of elements in the stack.
   *
   * @readonly
   */
  length: number;

  /**
   * Clears the stack.
   */
  clear(): void;

  /**
   * Checks whether the stack is empty or not.
   *
   * @returns TRUE if the stack is empty, FALSE otherwise.
   */
  isEmpty(): boolean;

  /**
   * Removes the first element from the top of the stack and returns it. Throws an error if the stack is empty.
   *
   * @returns Removed element.
   */
  pop(): T;

  /**
   * Adds element at the top of the stack.
   *
   * @param element Element to add.
   */
  push(element: T): void;

  /**
   * Gets element from the top of the stack without its removal.
   *
   * @returns Stack element.
   */
  top(): T;

}
