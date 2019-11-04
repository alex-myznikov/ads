import { compareAsNumbers, CompareFunc } from '../comparators';
import { DoublyLinkedList } from '../lists';
import { IQueue } from './queue.interface';
import { ListBasedStructureCommonAbstract } from './list-based-structure.class';
import { Node } from '../lists/doubly-linked-list.class';
import { Position } from '../position.class';

/**
 * Implementation of a sorted priority queue.
 */
export class SortedPriorityQueue<K, V = never>
  extends ListBasedStructureCommonAbstract<K | [K, V]>
  implements IQueue<K | [K, V]> {

  protected list: DoublyLinkedList<K | [K, V]>;

  /**
   * Creates an instance of SortedPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    super();
    this.list = new DoublyLinkedList<K | [K, V]>(elements);
  }

  enqueue(element: K | [K, V]) {
    const position = this.findPosition(element);

    if (!position) this.list.addLast(element);
    else this.list.addBefore(position, element);
  }

  dequeue(): K | [K, V] {
    try {
      return this.list.removeFirst();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  first(): K | [K, V] {
    const position = this.list.first();

    if (!position) throw new Error('Queue is empty');

    return position.element;
  }

  /**
   * Finds the leftmost element with key greater than or equal to the key of the specified element.
   *
   * @protected
   * @param element Queue element candidate.
   * @returns Position to be the next for the element or undefined if its position to be the last.
   */
  protected findPosition(element: K | [K, V]): Position<K | [K, V], Node<K | [K, V]>> | undefined {
    let position = this.list.first();

    if (!position) return;

    while (position) {
      if (this.compare(
        Array.isArray(element) ? element[0] : element,
        Array.isArray(position.element) ? position.element[0] : position.element,
      )) return position;
      position = this.list.after(position);
    }

    return;
  }

}
