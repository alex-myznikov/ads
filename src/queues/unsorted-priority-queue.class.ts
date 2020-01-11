import { ADSError } from '../errors';
import { compareAsNumbers, IComparator, ComparisonResult } from '../comparators';
import { ListBasedStructure } from './list-based-structure.class';
import { Node, DoublyLinkedList } from '../lists/doubly-linked-list.class';
import { Position } from '../position.class';
import { QueueAbstract } from './queue.class';

/**
 * Container of elements which grants access to the least item stored in linear time and takes constant time
 * for insertion. This structure is based on DoublyLinkedList.
 */
export class UnsortedPriorityQueue<K, V = never>
  extends QueueAbstract<K | [K, V], ListBasedStructure<K | [K, V], DoublyLinkedList<K | [K, V]>>> {

  /**
   * Creates an instance of UnsortedPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: IComparator<K> = compareAsNumbers) {
    super(new ListBasedStructure(new DoublyLinkedList<K | [K, V]>(elements)));
  }

  dequeue(): K | [K, V] {
    return this.structure.list.delete(this.findMin());
  }

  enqueue(element: K | [K, V]) {
    this.structure.list.addLast(element);
  }

  /**
   * Finds element with the smallest key according to the implemented comparison technique.
   * Throws an error if the queue is empty.
   *
   * @protected
   * @returns Position of the element.
   */
  protected findMin(): Position<K | [K, V], Node<K | [K, V]>> {
    let min = this.structure.list.getFirst();

    if (!min) throw new ADSError('Queue is empty');

    let position = this.structure.list.getAfter(min);

    while (position) {
      if (this.compare(
        Array.isArray(position.element) ? position.element[0] : position.element,
        Array.isArray(min.element) ? min.element[0] : min.element,
      ) === ComparisonResult.LESS) min = position;
      position = this.structure.list.getAfter(position);
    }

    return min;
  }

  getFirst(): K | [K, V] {
    return this.findMin().element;
  }

}
