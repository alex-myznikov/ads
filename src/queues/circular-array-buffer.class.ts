import { CircularArrayBasedStructure } from './circular-array-based-structure.class';
import { QueueAbstract } from './queue.class';

/**
 * Implementation of a circular array buffer.
 */
export class CircularArrayBuffer<T> extends QueueAbstract<T, CircularArrayBasedStructure<T>> {

  /**
   * Maximum size of a sequence the buffer can store without overwriting itself.
   *
   * @readonly
   */
  get maxLength() {
    return this.structure.len;
  }

  /**
   * Creates an instance of CircularArrayBuffer.
   *
   * @param len Buffer total capacity.
   * @param elements List of elements to create the buffer with.
   * @param overwritable Flag allowing to overwrite the buffer if it is full. Is FALSE by default.
   */
  constructor(len: number, elements: T[] = [], protected overwritable = false) {
    super(new CircularArrayBasedStructure(len));
    for (const el of elements) this.enqueue(el);
  }

  /**
   * Checks whether the buffer can store any more values without overwriting itself.
   *
   * @returns TRUE if the buffer is full, FALSE otherwise.
   */
  isFull(): boolean {
    return this.length === this.maxLength;
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

    const element = this.structure.arr[this.structure.front];

    this.structure.front = (this.structure.front + 1) % this.maxLength;
    this.structure.size--;

    return element;
  }

  enqueue(element: T) {
    if (!this.isFull()) this.structure.size++;
    else if (!this.isOverwritable()) throw new Error('Buffer is full');
    else this.structure.front = (this.structure.front + 1) % this.maxLength;
    this.structure.arr[this.structure.rear] = element;
    this.structure.rear = (this.structure.rear + 1) % this.maxLength;
  }

  first(): T {
    if (this.isEmpty()) throw new Error('Buffer is empty');

    return this.structure.arr[this.structure.front];
  }

}
