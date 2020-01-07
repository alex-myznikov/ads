import { ADSError } from '../ads-error.class';
import { IContainer } from '../container.interface';
import { Position } from '../position.class';
import { PositionalListAbstract } from './positional-list.class';

/**
 * Stores element and basic structure of a list.
 */
export class Node<T> implements IContainer<T> {

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the list.
   * @param next Reference to the next node in the list.
   */
  constructor(public element: T, public next?: Node<T>) { }

}

/**
 * Implementation of a singly linked positional list.
 */
export class SinglyLinkedList<T> extends PositionalListAbstract<T, Node<T>> {

  /**
   * Creates an instance of SinglyLinkedList.
   *
   * @param elements List of elements to create the new list with.
   */
  constructor(elements: T[] = []) {
    super();
    for (const el of elements) this.addLast(el);
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
   * Adds element at the front of the list.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addFirst(element: T): Position<T, Node<T>> {
    if (!this.head) this.tail = this.head = new Node(element);
    else this.head = new Node(element, this.head);
    this.size++;

    return this.createPosition(this.head);
  }

  /**
   * Adds element at the back of the list.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addLast(element: T): Position<T, Node<T>> {
    if (!this.tail) this.tail = this.head = new Node(element);
    else this.tail = this.tail.next = new Node(element);
    this.size++;

    return this.createPosition(this.tail);
  }

  clear(instant = false) {
    if (!instant && this.head) {
      let node: Node<T> | undefined = this.head;

      while (node) {
        const next: Node<T> | undefined = node.next;

        node.next = node;
        node = next;
      }
    }

    delete this.tail;
    delete this.head;
    this.size = 0;
  }

  /**
   * Gets position after the specified position in the list.
   *
   * @param position Position in the list.
   * @returns Position or undefined if the specified position is the last.
   */
  getAfter(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const next = this.validate(position).next;

    return next ? this.createPosition(next) : next;
  }

  /**
   * Gets position of the first element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  getFirst(): Position<T, Node<T>> | undefined {
    return this.head ? this.createPosition(this.head) : this.head;
  }

  isDeprecated(node: Node<T>): boolean {
    return node.next === node;
  }

  /**
   * Gets position of the last element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  getLast(): Position<T, Node<T>> | undefined {
    return this.tail ? this.createPosition(this.tail) : this.tail;
  }

  /**
   * Removes the first element from the list and returns it. Throws an error if the list is empty.
   *
   * @returns Removed element.
   */
  removeFirst(): T {
    if (!this.head) throw new ADSError('List is empty');

    const head = this.head;

    this.head = this.head.next;
    if (!this.head) delete this.tail;
    head.next = head;
    this.size--;

    return head.element;
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

  *[Symbol.iterator](): IterableIterator<T> {
    if (!this.head) return;

    let node: Node<T> | undefined = this.head;

    while (node) {
      yield node.element;
      node = node.next;
    }
  }

}
