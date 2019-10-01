/**
 * Class for storing element and list structure.
 */
class Node<T> {

  /**
   * Next node of the list. Link to self if no next node.
   */
  next: Node<T>;

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the list.
   * @param next Next node of the list.
   */
  constructor(public element: T, next?: Node<T>) {
    this.next = next || this;
  }

}

/**
 * Implementation of a singly linked list. List consists of a collection of nodes each of that stores a reference
 * to a particular element of the list and to the next node.
 */
export class SinglyLinkedList<T = any> {

  /**
   * Head node of the list.
   *
   * @private
   */
  private head?: Node<T>;

  /**
   * Number of nodes in the list.
   *
   * @private
   */
  private size: number;

  /**
   * Tail node of the list.
   *
   * @private
   */
  private tail?: Node<T>;

  /**
   * Total number of elements in the list.
   */
  get length() {
    return this.size;
  }

  /**
   * Creates an instance of SinglyLinkedList.
   *
   * @param elements Initial elements of the list.
   */
  constructor(...elements: any[]) {
    this.size = 0;
    for (const val of elements) this.addLast(val);
  }

  /**
   * Inserts new element at the beginning of the list.
   *
   * @param element Element to insert.
   */
  addFirst(element: T) {
    if (this.isEmpty()) this.tail = this.head = new Node(element);
    else this.head = new Node(element, this.head);
    this.size++;
  }

  /**
   * Inserts new element at the end of the list.
   *
   * @param element Element to insert.
   */
  addLast(element: T) {
    if (this.isEmpty() || !this.tail) this.tail = this.head = new Node(element);
    else this.tail = this.tail.next = new Node(element);
    this.size++;
  }

  /**
   * Gets the first element in the list. Throws an error if list is empty.
   *
   * @returns List element.
   */
  first(): T {
    if (this.isEmpty() || !this.head) throw new Error('List is empty');

    return this.head.element;
  }

  /**
   * Checks whether the list is empty or not.
   *
   * @returns TRUE if list element, false otherwise.
   */
  isEmpty() {
    return !this.length;
  }

  /**
   * Gets the last element in the list. Throws an error if list is empty.
   *
   * @returns List element.
   */
  last(): T {
    if (this.isEmpty() || !this.tail) throw new Error('List is empty');

    return this.tail.element;
  }

  /**
   * Removes the first element in the list and returns it. Throws an error if list is empty.
   *
   * @returns List element.
   */
  removeFirst(): T {
    if (this.isEmpty() || !this.head) throw new Error('List is empty');

    const element = this.head.element;

    this.head = this.head.next;
    this.size--;
    if (this.isEmpty()) this.tail = this.head;

    return element;
  }

  /**
   * Gets iteration of all elements in the list.
   */
  *[Symbol.iterator]() {
    if (this.isEmpty() || !this.head) return;

    let node = this.head;

    while (true) {
      yield node.element;
      if (node === node.next) break;
      node = node.next;
    }
  }

}
