import { IQueue } from './queue.interface';
import { ListBasedStructureCommonAbstract } from './list-based-structure.class';
import { SinglyLinkedList } from '../lists';

/**
 * Implementation of a linked queue.
 */
export class LinkedQueue<T> extends ListBasedStructureCommonAbstract<T> implements IQueue<T> {

  protected list: SinglyLinkedList<T>;

  /**
   * Creates an instance of LinkedQueue.
   *
   * @param elements List of elements to create the new queue with.
   */
  constructor(elements: T[] = []) {
    super();
    this.list = new SinglyLinkedList<T>(elements);
  }

  dequeue(): T {
    try {
      return this.list.removeFirst();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.list.addLast(element);
  }

  first(): T {
    const position = this.list.first();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

}
