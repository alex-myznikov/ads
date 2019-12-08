import { IStructure } from '../structure.interface';

/**
 * Provides implementation of the common behaviour for structures based on arrays.
 */
export class ArrayBasedStructure<T> implements IStructure {

  get length() {
    return this.arr.length;
  }

  /**
   * Creates an instance of ArrayBasedStructure.
   *
   * @param arr Reference to the underlying array data structure.
   */
  constructor(public arr: T[]) { }

  clear() {
    this.arr = [];
  }

  isEmpty(): boolean {
    return !this.length;
  }

}
