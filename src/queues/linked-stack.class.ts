import { ADSError } from '../ads-error.class';
import { ListBasedStructure } from './list-based-structure.class';
import { SinglyLinkedList } from '../lists';
import { StackAbstract } from './stack.class';

/**
 * Implementation of a linked stack.
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
