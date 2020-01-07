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
   * @param prev Reference to the previous node in the list.
   */
  constructor(public element: T, public next?: Node<T>, public prev?: Node<T>) { }

}

/**
 * Implementation of a doubly linked positional list.
 */
export class DoublyLinkedList<T> extends PositionalListAbstract<T, Node<T>> {

  /**
   * Creates an instance of DoublyLinkedList.
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

    return this.createPosition(this.insertBetween(element, node, node.next));
  }

  /**
   * Adds element before the specified position in the list.
   *
   * @param position Position in the list.
   * @param element Element to add before the position.
   * @returns Position of the added element.
   */
  addBefore(position: Position<T, Node<T>>, element: T): Position<T, Node<T>> {
    const node = this.validate(position);

    return this.createPosition(this.insertBetween(element, node.prev, node));
  }

  /**
   * Adds element at the front of the list.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addFirst(element: T): Position<T, Node<T>> {
    return this.createPosition(this.insertBetween(element, undefined, this.head)); // eslint-disable-line no-undefined
  }

  /**
   * Adds element at the back of the list.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addLast(element: T): Position<T, Node<T>> {
    return this.createPosition(this.insertBetween(element, this.tail));
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
   * Deletes element at the specified position.
   *
   * @param position Position of an element.
   * @returns Deleted element.
   */
  delete(position: Position<T, Node<T>>): T {
    return this.deleteNode(this.validate(position));
  }

  /**
   * Deletes element node from the list.
   *
   * @protected
   * @param node Instance of a node from the list.
   * @returns Deleted element.
   */
  protected deleteNode(node: Node<T>): T {
    const pred = node.prev;
    const succ = node.next;

    if (pred) pred.next = succ;
    else this.head = succ;
    if (succ) succ.prev = pred;
    else this.tail = pred;
    node.next = node.prev = node;
    this.size--;

    return node.element;
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
   * Gets position before the specified position in the list.
   *
   * @param position Position in the list.
   * @returns Position or undefined if the specified position is the first.
   */
  getBefore(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const prev = this.validate(position).prev;

    return prev ? this.createPosition(prev) : prev;
  }

  /**
   * Gets position of the first element in the list.
   *
   * @returns Position of the element or undefined if the list is empty.
   */
  getFirst(): Position<T, Node<T>> | undefined {
    return this.head ? this.createPosition(this.head) : this.head;
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
   * Inserts element node between the specified consecutive nodes in the list.
   * Reassigns head/tail when the node is inserted on outer bounds.
   *
   * @protected
   * @param element Element to insert.
   * @param pred Predecessor node.
   * @param succ Successor node.
   * @returns Inserted node.
   */
  protected insertBetween(element: T, pred?: Node<T>, succ?: Node<T>): Node<T> {
    const node = new Node(element, succ, pred);

    if (pred) pred.next = node;
    else this.head = node;
    if (succ) succ.prev = node;
    else this.tail = node;
    this.size++;

    return node;
  }

  isDeprecated(node: Node<T>): boolean {
    return node.next === node;
  }

  /**
   * Removes the first element from the list and returns it. Throws an error if the list is empty.
   *
   * @returns Removed element.
   */
  removeFirst(): T {
    if (!this.head) throw new ADSError('List is empty');

    return this.deleteNode(this.head);
  }

  /**
   * Removes the last element from the list and returns it. Throws an error if the list is empty.
   *
   * @returns Removed element.
   */
  removeLast(): T {
    if (!this.tail) throw new ADSError('List is empty');

    return this.deleteNode(this.tail);
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

  *[Symbol.iterator]() {
    if (!this.head) return;

    let node: Node<T> | undefined = this.head;

    while (node) {
      yield node.element;
      node = node.next;
    }
  }

}
