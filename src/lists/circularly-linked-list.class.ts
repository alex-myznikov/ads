import { IContainer } from '../container.interface';
import { Position } from '../position.class';
import { PositionalListAbstract } from './positional-list.class';

/**
 * Stores element and basic structure of a list.
 */
export class Node<T> implements IContainer<T> {

  next: Node<T>;

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the list.
   * @param next Reference to the next node in the list.
   */
  constructor(public element: T, next?: Node<T>) {
    this.next = next || this;
  }

}

/**
 * Implementation of a circularly linked positional list.
 */
export class CircularlyLinkedList<T> extends PositionalListAbstract<T, Node<T>> {

  /**
   * Creates an instance of CircularlyLinkedList.
   *
   * @param elements List of elements to create the new list with.
   */
  constructor(elements: T[] = []) {
    super();

    for (const val of elements) {
      this.addCurrent(val);
      this.rotate();
    }
  }

  /**
   * Adds element after the specified position in the list.
   *
   * @param position Position in the list.
   * @param element Element to add after the position.
   * @returns Position of the added element.
   */
  addAfter(position: Position<T, Node<T>>, element: T): Position<T, Node<T>> {
    const node = this.validate(position);

    node.next = new Node(element, node.next);
    this.size++;

    return this.createPosition(node.next);
  }

  /**
   * Adds element at the current front of the list.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addCurrent(element: T): Position<T, Node<T>> {
    if (!this.tail) this.tail = new Node(element);
    else this.tail.next = new Node(element, this.tail.next);
    this.size++;

    return this.createPosition(this.tail.next);
  }

  /**
   * Gets position after the specified position in the list.
   *
   * @param position Position in the list.
   * @returns Position after the specified position.
   */
  after(position: Position<T, Node<T>>): Position<T, Node<T>> {
    return this.createPosition(this.validate(position).next);
  }

  /**
   * Clears the list. If instant set TRUE it takes O(1) time but does not deprecate existing positions.
   *
   * @param instant TRUE to deprecate all existing positions, FALSE to skip deprecation (client code cares of it).
   */
  clear(instant = false) {
    if (!instant && this.tail) {
      let node = this.tail.next;

      do {
        const next = node.next;

        delete node.next;
        node = next;
      } while (node !== this.tail.next);
    }

    delete this.tail;
    this.size = 0;
  }

  /**
   * Gets position of the current front element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  current(): Position<T, Node<T>> | undefined {
    return this.tail ? this.createPosition(this.tail.next) : this.tail;
  }

  isDeprecated(node: Node<T>): boolean {
    return !node.next;
  }

  /**
   * Gets position of the current back element from the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  previous(): Position<T, Node<T>> | undefined {
    return this.tail ? this.createPosition(this.tail) : this.tail;
  }

  /**
   * Removes current front element from the list and returns it. Throws an error if the list is empty.
   *
   * @returns Removed element.
   */
  removeCurrent(): T {
    if (!this.tail) throw new Error('List is empty');

    const node = this.tail.next;

    if (node === this.tail) delete this.tail;
    else this.tail.next = node.next;
    delete node.next;
    this.size--;

    return node.element;
  }

  /**
   * Replaces element at the specified position.
   *
   * @param position Position of an element.
   * @param element Element to replace the existing with.
   * @returns Replaced element.
   */
  replace(position: Position<T, Node<T>>, element: T): T {
    const node = this.validate(position);
    const replacedElement = node.element;

    node.element = element;

    return replacedElement;
  }

  /**
   * Rotates current front element of the list to the back.
   */
  rotate() {
    if (this.tail) this.tail = this.tail.next;
  }

  *[Symbol.iterator]() {
    if (!this.tail) return;

    let node = this.tail.next;

    do {
      yield node.element;
      node = node.next;
    } while (node !== this.tail.next);
  }

}
