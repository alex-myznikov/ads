import { IStructure } from './structure.interface';

/**
 * An abstract stack (LIFO) data structure.
 */
export abstract class StackAbstract<T, S extends IStructure> {

  /**
   * Number of elements in the stack.
   *
   * @readonly
   */
  get length(): number {
    return this.structure.length;
  }

  /**
   * Creates an instance of StackAbstract.
   *
   * @param structure Data structure.
   */
  constructor(protected structure: S) { }

  /**
   * Clears the stack.
   */
  clear() {
    this.structure.clear();
  }

  /**
   * Checks whether the stack is empty or not.
   *
   * @returns TRUE if the stack is empty, FALSE otherwise.
   */
  isEmpty(): boolean {
    return this.structure.isEmpty();
  }

  /**
   * Removes the first element from the top of the stack and returns it. Throws an error if the stack is empty.
   *
   * @returns Removed element.
   */
  abstract pop(): T;

  /**
   * Adds element at the top of the stack.
   *
   * @param element Element to add.
   */
  abstract push(element: T): void;

  /**
   * Gets element from the top of the stack without its removal.
   *
   * @returns Stack element.
   */
  abstract top(): T;

}
