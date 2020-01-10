import { ADSError } from '../errors';
import { CircularlyLinkedList } from '../lists/circularly-linked-list.class';
import { ListBasedStructure } from './list-based-structure.class';
import { QueueAbstract } from './queue.class';

/**
 * Container of elements in which operations are performed based on FIFO principle and the last position
 * is connected back to the first position to make a circle. This structure is based on CircularlyLinkedList.
 */
export class CircularQueue<T> extends QueueAbstract<T, ListBasedStructure<T, CircularlyLinkedList<T>>> {

  /**
   * Creates an instance of CircularQueue.
   *
   * @param elements List of elements to create the new queue with.
   */
  constructor(elements: T[] = []) {
    super(new ListBasedStructure(new CircularlyLinkedList<T>(elements)));
  }

  dequeue(): T {
    try {
      return this.structure.list.removeCurrent();
    } catch (err) {
      throw new ADSError('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.structure.list.addCurrent(element);
    this.structure.list.rotate();
  }

  getFirst(): T {
    const position = this.structure.list.getCurrent();

    if (!position) throw new ADSError('Queue is empty');

    return position.element;
  }

  /**
   * Rotates the queue's rear towards its front by the specified number of steps.
   *
   * @param steps Number of steps.
   */
  rotate(steps: number = 1) {
    for (let i = 0; i < steps; i++) this.structure.list.rotate();
  }

}
