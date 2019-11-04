import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { IQueue } from './queue.interface';
import { Locator } from 'src/locator.class';

/**
 * Implementation of an adaptable heap priority queue.
 */
export class AdaptableHeapPriorityQueue<K, V = never> implements IQueue<K | [K, V]> {

  /**
   * Reference to the underlying array data structure.
   *
   * @protected
   */
  protected arr: Locator<K | [K, V]>[];

  get length() {
    return this.arr.length;
  }

  /**
   * Creates an instance of AdaptableHeapPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    this.arr = [];
    for (const val of elements) this.enqueue(val);
  }

  /**
   * Performs up-heap or down-heap bubbling for the specified element depending on its position in the heap.
   *
   * @protected
   * @param i Element index in the array.
   */
  protected bubble(i: number) {
    if (i > 0 && this.arr[i] < this.arr[Math.floor((i - 1) / 2)]) this.upheap(i);
    else this.downheap(i);
  }

  clear() {
    this.arr = [];
  }

  dequeue(): K | [K, V] {
    if (this.isEmpty()) throw new Error('Queue is empty');

    this.swap(0, this.length - 1);

    const locator = this.arr.pop() as Locator<K | [K, V]>;

    this.downheap(0);

    return locator.element;
  }

  /**
   * Performs down-heap bubbling for the specified element.
   *
   * @protected
   * @param i Element index in the array.
   */
  protected downheap(i: number) {
    let childIndex = i * 2 + 1;
    let smallChild = this.arr[childIndex].element;

    if (!smallChild) return;

    const parent = this.arr[i].element;
    const rightChild = this.arr[childIndex + 1].element;

    if (rightChild && this.compare(
      Array.isArray(rightChild) ? rightChild[0] : rightChild,
      Array.isArray(smallChild) ? smallChild[0] : smallChild,
    ) === ComparisonResult.LESS) {
      childIndex++;
      smallChild = rightChild;
    }

    if (this.compare(
      Array.isArray(parent) ? parent[0] : parent,
      Array.isArray(smallChild) ? smallChild[0] : smallChild,
    ) === ComparisonResult.GREATER) {
      this.swap(i, childIndex);
      this.downheap(childIndex);
    }
  }

  /**
   * @override IStack
   * @returns Locator of the element.
   */
  enqueue(element: K | [K, V]): Locator<K | [K, V]> {
    const locator = new Locator(element, this.length);

    this.arr.push(locator);
    this.upheap(this.length - 1);

    return locator;
  }

  first(): K | [K, V] {
    if (this.isEmpty()) throw new Error('Queue is empty');

    return this.arr[0].element;
  }

  isEmpty(): boolean {
    return !this.arr.length;
  }

  /**
   * Removes element from the queue by locator and returns it. Throws an error if the queue is empty
   * or the locator is not valid.
   *
   * @param locator Locator of the element.
   * @returns Removed element.
   */
  remove(locator: Locator<K | [K, V]>): K | [K, V] {
    const elementIndex = locator.index;

    if (elementIndex < 0 ||
      elementIndex > this.length ||
      this.arr[elementIndex] !== locator) throw new Error('Locator is not valid.');
    else if (elementIndex === this.length - 1) this.arr.pop();
    else {
      this.swap(elementIndex, this.length - 1);
      this.arr.pop();
      this.bubble(elementIndex);
    }

    return locator.element;
  }

  /**
   * Swaps two elements in the array by index.
   *
   * @protected
   * @param i Element index in the array.
   * @param j Element index in the array.
   */
  protected swap(i: number, j: number) {
    const element = this.arr[i];

    this.arr[i].index = j;
    this.arr[i] = this.arr[j];
    this.arr[j].index = i;
    this.arr[j] = element;
  }

  /**
   * Performs up-heap bubbling for the specified element.
   *
   * @protected
   * @param i Element index in the array.
   */
  protected upheap(i: number) {
    if (!i) return;

    const parentIndex = Math.floor((i - 1) / 2);
    const parent = this.arr[parentIndex].element;
    const child = this.arr[i].element;

    if (this.compare(
      Array.isArray(parent) ? parent[0] : parent,
      Array.isArray(child) ? child[0] : child,
    ) === ComparisonResult.GREATER) {
      this.swap(i, parentIndex);
      this.upheap(parentIndex);
    }
  }

  /**
   * Updates element in the queue by locator. Throws an error if the locator is not valid.
   *
   * @param locator Locator of the element.
   * @param element The element updatement.
   */
  update(locator: Locator<K | [K, V]>, element: K | [K, V]) {
    const elementIndex = locator.index;

    if (elementIndex < 0 ||
      elementIndex > this.length ||
      this.arr[elementIndex] !== locator) throw new Error('Locator is not valid.');
    locator._internal.element = element;
    this.bubble(elementIndex);
  }

}
