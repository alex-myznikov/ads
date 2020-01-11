import { ADSError } from '../errors';
import { compareAsNumbers, IComparator, ComparisonResult } from '../comparators';
import { ListBasedStructure } from './list-based-structure.class';
import { Node, DoublyLinkedList } from '../lists/doubly-linked-list.class';
import { Position } from '../position.class';
import { QueueAbstract } from './queue.class';

/**
 * Container of elements which grants access to the least item stored in constant time and takes linear time
 * for insertion. This structure is based on DoublyLinkedList.
 */
export class SortedPriorityQueue<K, V = never>
  extends QueueAbstract<K | [K, V], ListBasedStructure<K | [K, V], DoublyLinkedList<K | [K, V]>>> {

  /**
   * Creates an instance of SortedPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: IComparator<K> = compareAsNumbers) {
    super(new ListBasedStructure(new DoublyLinkedList<K | [K, V]>(elements)));
  }

  dequeue(): K | [K, V] {
    try {
      return this.structure.list.removeFirst();
    } catch (err) {
      throw new ADSError('Queue is empty');
    }
  }

  enqueue(element: K | [K, V]) {
    const position = this.findPosition(element);

    if (!position) this.structure.list.addLast(element);
    else this.structure.list.addBefore(position, element);
  }

  /**
   * Finds the leftmost element with key greater than or equal to the key of the specified element.
   *
   * @protected
   * @param element Queue element candidate.
   * @returns Position to be the next for the element or undefined if its position to be the last.
   */
  protected findPosition(element: K | [K, V]): Position<K | [K, V], Node<K | [K, V]>> | undefined {
    let position = this.structure.list.getFirst();

    if (!position) return;

    while (position) {
      if (this.compare(
        Array.isArray(position.element) ? position.element[0] : position.element,
        Array.isArray(element) ? element[0] : element,
      ) === ComparisonResult.GREATER) return position;
      position = this.structure.list.getAfter(position);
    }

    return;
  }

  getFirst(): K | [K, V] {
    const position = this.structure.list.getFirst();

    if (!position) throw new ADSError('Queue is empty');

    return position.element;
  }

}
