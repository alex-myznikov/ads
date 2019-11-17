import { IStructure } from './structure.interface';

/**
 * Provides implementation of the common behaviour for structures based on circular arrays.
 */
export class CircularArrayBasedStructure<T> implements IStructure {

  /**
   * Reference to the underlying array data structure.
   */
  arr!: Array<T>;

  /**
   * Pointer at the front element of the stored sequence.
   */
  front!: number;

  /**
   * Size of the stored sequence.
   */
  size!: number;

  /**
   * Pointer at the rear element of the stored sequence.
   */
  rear!: number;

  get length() {
    return this.size;
  }

  /**
   * Creates an instance of CircularArrayBasedStructure.
   *
   * @param len Total capacity of the underlying array.
   */
  constructor(public len: number) {
    this.clear();
  }

  clear() {
    this.arr = Array(this.len);
    this.front = 0;
    this.size = 0;
    this.rear = 0;
  }

  isEmpty(): boolean {
    return !this.size;
  }

}
