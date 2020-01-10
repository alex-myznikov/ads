import { ADSError } from '../errors';
import { IContainer } from '../container.interface';
import { Position } from '../position.class';
import { PositionalListAbstract } from './positional-list.class';

/**
 * Stores element and basic structure of a circularly linked list.
 */
export class Node<T> implements IContainer<T> {

  /**
   * Reference to the next node. The only node in the list references himself.
   */
  next: Node<T>;

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the list.
   * @param next Reference to the next node.
   */
  constructor(public element: T, next?: Node<T>) {
    this.next = next || this;
  }

}

/**
 * Positional linked list with nodes linked in one direction from head to tail and tail linked to head.
 *
 * @template T Type of elements stored in the list.
 */
export class CircularlyLinkedList<T> extends PositionalListAbstract<T, Node<T>> {

  /**
   * Creates an instance of CircularlyLinkedList.
   *
   * @param elements Array of elements to create the new linked list with.
   */
  constructor(elements: T[] = []) {
    super();

    for (const el of elements) {
      this.addCurrent(el);
      this.rotate();
    }
  }

  /**
   * Adds element after the specified position in the list. Throws an error if the position
   * does not belong to this list or its element has been removed.
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
   * Gets position after the specified position in the list. Throws an error if the position
   * does not belong to this list or its element has been removed.
   *
   * @param position Position in the list.
   * @returns Position of the element next to the specified.
   */
  getAfter(position: Position<T, Node<T>>): Position<T, Node<T>> {
    return this.createPosition(this.validate(position).next);
  }

  protected isDeprecated(node: Node<T>): boolean {
    return !node.next;
  }

  /**
   * Gets position of the current front element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  getCurrent(): Position<T, Node<T>> | undefined {
    return this.tail ? this.createPosition(this.tail.next) : this.tail;
  }

  /**
   * Gets position of the current last element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  getLast(): Position<T, Node<T>> | undefined {
    return this.tail ? this.createPosition(this.tail) : this.tail;
  }

  /**
   * Removes current front element from the list and returns it. Deprecates all positions pointing to that element.
   * Throws an error if the list is empty.
   *
   * @returns Removed element.
   */
  removeCurrent(): T {
    if (!this.tail) throw new ADSError('List is empty');

    const node = this.tail.next;

    if (node === this.tail) delete this.tail;
    else this.tail.next = node.next;
    delete node.next;
    this.size--;

    return node.element;
  }

  /**
   * Replaces element at the specified position. Throws an error if the position
   * does not belong to this list or its element has been removed.
   *
   * @param position Position in the list.
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

  *[Symbol.iterator](): IterableIterator<T> {
    if (!this.tail) return;

    let node = this.tail.next;

    do {
      yield node.element;
      node = node.next;
    } while (node !== this.tail.next);
  }

}
