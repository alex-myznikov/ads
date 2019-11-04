import { IStack } from './stack.interface';
import { ListBasedStructureCommonAbstract } from './list-based-structure.class';
import { SinglyLinkedList } from '../lists';

/**
 * Implementation of a linked stack.
 */
export class LinkedStack<T> extends ListBasedStructureCommonAbstract<T> implements IStack<T> {

  protected list: SinglyLinkedList<T>;

  /**
   * Creates an instance of LinkedStack.
   *
   * @param elements List of elements to create the new stack with.
   */
  constructor(elements: T[] = []) {
    super();
    this.list = new SinglyLinkedList<T>(elements);
  }

  pop(): T {
    try {
      return this.list.removeFirst();
    } catch (err) {
      throw new Error('Stack is empty');
    }
  }

  push(element: T) {
    this.list.addFirst(element);
  }

  top(): T {
    const position = this.list.first();

    if (!position) throw new Error('Stack is empty');

    return position.element;
  }

}
