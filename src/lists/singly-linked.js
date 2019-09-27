'use strict';

/**
 * Class for storing element and list structure.
 */
class Node {

  /**
   * Creates an instance of Node.
   *
   * @param {*} element Element of the list.
   * @param {Node} next Next node of the list.
   */
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }

}

/**
 *
 *
 * @export
 * @class SinglyLinkedList
 */
class SinglyLinkedList {

  /**
   * Total number of elements in the list.
   */
  get length() {
    return this._size;
  }

  constructor(...elements) {
    this._size = 0;
    for (const val of elements) this.addLast(val);
  }

  addFirst(element) {
    if (this.isEmpty()) this._tail = this._head = new Node(element);
    else this._head = new Node(element, this._head);
    this._size++;
  }

  addLast(element) {
    if (this.isEmpty()) this._tail = this._head = new Node(element);
    else this._tail = this._tail.next = new Node(element);
    this._size++;
  }

  first() {
    if (this.isEmpty()) throw new Error('List is empty');

    return this._head.element;
  }

  isEmpty() {
    return !this.length;
  }

  last() {
    if (this.isEmpty()) throw new Error('List is empty');

    return this._tail.element;
  }

  removeFirst() {
    if (this.isEmpty()) throw new Error('List is empty');

    const element = this._head.element;

    this._head = this._head.next;
    this._size--;
    if (this.isEmpty()) this._tail = this._head;

    return element;
  }

  /**
   * Gets iteration of all elements in the list.
   *
   * @return {IterableIterator} Iteration of elements.
   */
  *[Symbol.iterator]() {
    if (this.isEmpty()) return;

    let node = this._head;

    do {
      yield node.element;
      node = node.next;
    } while (node);
  }

}

module.exports = SinglyLinkedList;
