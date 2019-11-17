import { compareAsNumbers, CompareFunc, ComparisonResult } from '../comparators';
import { DoublyLinkedList } from '../lists';
import { ListBasedStructure } from './list-based-structure.class';
import { Node } from '../lists/doubly-linked-list.class';
import { Position } from '../position.class';
import { QueueAbstract } from './queue.class';

/**
 * Implementation of a sorted priority queue.
 */
export class SortedPriorityQueue<K, V = never>
  extends QueueAbstract<K | [K, V], ListBasedStructure<K | [K, V], DoublyLinkedList<K | [K, V]>>> {

  /**
   * Creates an instance of SortedPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    super(new ListBasedStructure(new DoublyLinkedList<K | [K, V]>(elements)));
  }

  enqueue(element: K | [K, V]) {
    const position = this.findPosition(element);

    if (!position) this.structure.list.addLast(element);
    else this.structure.list.addBefore(position, element);
  }

  dequeue(): K | [K, V] {
    try {
      return this.structure.list.removeFirst();
    } catch (err) {
      throw new Error('Queue is empty');
    }
  }

  first(): K | [K, V] {
    const position = this.structure.list.first();

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
    let position = this.structure.list.first();

    if (!position) return;

    while (position) {
      if (this.compare(
        Array.isArray(position.element) ? position.element[0] : position.element,
        Array.isArray(element) ? element[0] : element,
      ) === ComparisonResult.GREATER) return position;
      position = this.structure.list.after(position);
    }

    return;
  }

}
