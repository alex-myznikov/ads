import { DoublyLinkedList } from '../lists';
import { ListBasedStructure } from './list-based-structure.class';
import { QueueAbstract } from './queue.class';

/**
 * Implementation of a linked deque.
 */
export class LinkedDeque<T> extends QueueAbstract<T, ListBasedStructure<T, DoublyLinkedList<T>>> {

  /**
   * Creates an instance of LinkedDeque.
   *
   * @param elements List of elements to create the new deque with.
   */
  constructor(elements: T[] = []) {
    super(new ListBasedStructure(new DoublyLinkedList<T>(elements)));
  }

  dequeue(): T {
    try {
      return this.structure.list.removeFirst();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  /**
   * Removes the last element from the rear of the queue and returns it. Throws an error if the queue is empty.
   *
   * @returns Removed element.
   */
  dequeueLast(): T {
    try {
      return this.structure.list.removeLast();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  enqueue(element: T) {
    this.structure.list.addLast(element);
  }

  /**
   * Adds element at the front of the queue.
   *
   * @param element Element to add.
   */
  enqueueFirst(element: T) {
    this.structure.list.addFirst(element);
  }

  first(): T {
    const position = this.structure.list.first();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

  /**
   * Gets element from the rear of the queue without its removal.
   *
   * @returns Queue element.
   */
  last(): T {
    const position = this.structure.list.last();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

}
