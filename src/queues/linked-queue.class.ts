import { ListBasedStructure } from './list-based-structure.class';
import { QueueAbstract } from './queue.class';
import { SinglyLinkedList } from '../lists';

/**
 * Implementation of a linked queue.
 */
export class LinkedQueue<T> extends QueueAbstract<T, ListBasedStructure<T, SinglyLinkedList<T>>> {

  /**
   * Creates an instance of LinkedQueue.
   *
   * @param elements List of elements to create the new queue with.
   */
  constructor(elements: T[] = []) {
    super(new ListBasedStructure(new SinglyLinkedList(elements)));
  }

  dequeue(): T {
    try {
      return this.structure.list.removeFirst();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.structure.list.addLast(element);
  }

  first(): T {
    const position = this.structure.list.first();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

}
