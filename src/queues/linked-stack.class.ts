import { ADSError } from '../errors';
import { ListBasedStructure } from './list-based-structure.class';
import { SinglyLinkedList } from '../lists/singly-linked-list.class';
import { StackAbstract } from './stack.class';

/**
 * Container of elements that are inserted and removed according to the LIFO principle.
 * This structure is based on SinglyLinkedList.
 */
export class LinkedStack<T> extends StackAbstract<T, ListBasedStructure<T, SinglyLinkedList<T>>> {

  /**
   * Creates an instance of LinkedStack.
   *
   * @param elements List of elements to create the new stack with.
   */
  constructor(elements: T[] = []) {
    super(new ListBasedStructure(new SinglyLinkedList<T>(elements)));
  }

  pop(): T {
    try {
      return this.structure.list.removeFirst();
    } catch (err) {
      throw new ADSError('Stack is empty');
    }
  }

  push(element: T) {
    this.structure.list.addFirst(element);
  }

  top(): T {
    const position = this.structure.list.getFirst();

    if (!position) throw new ADSError('Stack is empty');

    return position.element;
  }

}
