import { CircularlyLinkedList } from '../lists';
import { ListBasedStructure } from './list-based-structure.class';
import { QueueAbstract } from './queue.class';

/**
 * Implementation of a linked circular queue.
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
      throw new Error('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.structure.list.addCurrent(element);
    this.structure.list.rotate();
  }

  first(): T {
    const position = this.structure.list.current();

    if (!position) throw new Error('Queue is empty');

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
