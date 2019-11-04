import { compareAsNumbers, CompareFunc } from '../comparators';
import { DoublyLinkedList } from '../lists';
import { IQueue } from './queue.interface';
import { ListBasedStructureCommonAbstract } from './list-based-structure.class';
import { Node } from '../lists/doubly-linked-list.class';
import { Position } from '../position.class';

/**
 * Implementation of an unsorted priority queue.
 */
export class UnsortedPriorityQueue<K, V = never>
  extends ListBasedStructureCommonAbstract<K | [K, V]>
  implements IQueue<K | [K, V]> {

  protected list: DoublyLinkedList<K | [K, V]>;

  /**
   * Creates an instance of UnsortedPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    super();
    this.list = new DoublyLinkedList<K | [K, V]>(elements);
  }

  dequeue(): K | [K, V] {
    return this.list.delete(this.findMin());
  }

  enqueue(element: K | [K, V]) {
    this.list.addLast(element);
  }

  first(): K | [K, V] {
    return this.findMin().element;
  }

  /**
   * Finds element with the smallest key according to the implemented comparison technique.
   * Throws an error if the queue is empty.
   *
   * @protected
   * @returns Position of the element.
   */
  protected findMin(): Position<K | [K, V], Node<K | [K, V]>> {
    let min = this.list.first();

    if (!min) throw new Error('Queue is empty');

    let position = this.list.after(min);

    while (position) {
      if (this.compare(
        Array.isArray(min.element) ? min.element[0] : min.element,
        Array.isArray(position.element) ? position.element[0] : position.element,
      )) min = position;
      position = this.list.after(position);
    }

    return min;
  }

}
