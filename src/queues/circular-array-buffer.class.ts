import { ArrayBasedStructureCommonAbstract } from './array-based-structure.class';
import { IQueue } from './queue.interface';

/**
 * Implementation of a circular array buffer.
 */
export class CircularArrayBuffer<T> extends ArrayBasedStructureCommonAbstract<T> implements IQueue<T> {

  /**
   * Maximum size of a sequence the buffer can store without overwriting itself.
   *
   * @readonly
   */
  get maxLength() {
    return this.len;
  }

  /**
   * Creates an instance of CircularArrayBuffer.
   *
   * @param elements Initial elements of the queue.
   */
  constructor(elements: T[] = [], protected len: number, protected overwritable = false) {
    super(len);
    for (const val of elements) this.enqueue(val);
  }

  /**
   * Checks whether the buffer can store any more values without overwriting itself.
   *
   * @returns TRUE if the buffer is full, FALSE otherwise.
   */
  isFull(): boolean {
    return this.size === this.len;
  }

  /**
   * Checks whether the buffer can overwrite itself if its capacity is exhausted.
   *
   * @returns TRUE if the buffer allows overwriting, FALSE otherwise.
   */
  isOverwritable(): boolean {
    return this.overwritable;
  }

  dequeue(): T {
    if (this.isEmpty()) throw new Error('Buffer is empty');

    const element = this.arr[this.front];

    this.front = (this.front + 1) % this.len;
    this.size--;

    return element;
  }

  enqueue(element: T) {
    if (!this.isFull()) this.size++;
    else if (!this.isOverwritable()) throw new Error('Buffer is full');
    this.arr[this.rear] = element;
    this.rear = (this.rear + 1) % this.len;
  }

  first(): T {
    if (this.isEmpty()) throw new Error('Buffer is empty');

    return this.arr[this.front];
  }

}
