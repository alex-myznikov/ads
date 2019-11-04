import { CircularlyLinkedList } from '../lists';
import { IQueue } from './queue.interface';
import { ListBasedStructureCommonAbstract } from './list-based-structure.class';

/**
 * Implementation of a linked circular queue.
 */
export class CircularQueue<T> extends ListBasedStructureCommonAbstract<T> implements IQueue<T> {

  protected list: CircularlyLinkedList<T>;

  /**
   * Creates an instance of CircularQueue.
   *
   * @param elements List of elements to create the new queue with.
   */
  constructor(elements: T[] = []) {
    super();
    this.list = new CircularlyLinkedList<T>(elements);
  }

  dequeue(): T {
    try {
      return this.list.removeCurrent();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.list.addCurrent(element);
    this.list.rotate();
  }

  first(): T {
    const position = this.list.current();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

  /**
   * Rotates the queue's rear towards its front by the specified number of steps.
   *
   * @param steps Number of steps.
   */
  rotate(steps: number) {
    for (let i = 0; i < steps; i++) this.list.rotate();
  }

}
