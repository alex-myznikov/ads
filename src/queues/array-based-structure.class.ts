/**
 * Provides implementation of the common behaviour for structures based on circular arrays.
 */
export abstract class ArrayBasedStructureCommonAbstract<T> {

  /**
   * Reference to the underlying array data structure.
   *
   * @protected
   */
  protected arr!: Array<T>;

  /**
   * Pointer at the front element of the stored sequence.
   *
   * @protected
   */
  protected front!: number;

  /**
   * Size of the stored sequence.
   *
   * @protected
   */
  protected size!: number;

  /**
   * Pointer at the rear element of the stored sequence.
   *
   * @protected
   */
  protected rear!: number;

  get length() {
    return this.size;
  }

  /**
   * Creates an instance of ArrayBasedStructureCommonAbstract.
   *
   * @param len Total capacity of the underlying array.
   */
  constructor(protected len: number) {
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

  /**
   * Resizes the underlying array.
   *
   * @protected
   * @param len The new array length.
   */
  protected resize(len: number) {
    let walk: number;
    let swap: T;

    if (this.front) {
      for (let i = 0; i < this.length; i++) {
        walk = (i + this.front) % this.len;
        swap = this.arr[i];
        this.arr[i] = this.arr[walk];
        this.arr[walk] = swap;
      }
    }

    this.len = len;
    this.clear();
  }

}
