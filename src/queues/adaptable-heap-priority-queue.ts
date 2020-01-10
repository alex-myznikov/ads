import { ADSError } from '../errors';
import { ArrayBasedStructure } from './array-based-structure.class';
import { CompareFunc, compareAsNumbers, ComparisonResult } from '../comparators';
import { Locator } from '../locator.class';
import { QueueAbstract } from './queue.class';

/**
 * Container of elements which grants access to the least item stored in logarithmic time. Insertion operation
 * has logarithmic complexity as well. This structure is based on binary heap and can afford constant time insertion
 * if all queued elements are given in advance. It also allows to update elements after insertion and
 * keeps itself sorted.
 */
export class AdaptableHeapPriorityQueue<K, V = never>
  extends QueueAbstract<K | [K, V], ArrayBasedStructure<Locator<K | [K, V]>>> {

  /**
   * Creates an instance of AdaptableHeapPriorityQueue.
   *
   * @param elements List of elements to create the new priority queue with.
   * @param compare Comparison function for element search. Elements are compared as numbers by default.
   */
  constructor(elements: K[] | [K, V][] = [], protected compare: CompareFunc<K> = compareAsNumbers) {
    super(new ArrayBasedStructure([]));
    for (const el of elements) this.structure.arr.push(new Locator(el, this.length));

    if (this.length > 1) {
      const { index: start } = this.getParent(this.length - 1) as Locator<K | [K, V]>;

      for (let i = start; i >= 0; i--) this.downheap(i);
    }
  }

  /**
   * Performs up-heap or down-heap bubbling for the specified element depending on its position in the heap.
   *
   * @protected
   * @param i Element index in the array.
   */
  protected bubble(i: number) {
    if (!i) this.downheap(i);
    else {
      this.upheap(i);
      this.downheap(i);
    }
  }

  dequeue(): K | [K, V] {
    if (this.isEmpty()) throw new ADSError('Queue is empty');

    this.swap(0, this.length - 1);

    const locator = this.structure.arr.pop() as Locator<K | [K, V]>;

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
    if (this.hasLeftChild(i)) {
      let { element: leastChildElement, index: leastChildIndex } = this.getLeftChild(i) as Locator<K | [K, V]>;

      if (this.hasRightChild(i)) {
        const { element: rightChildElement, index: rightChildIndex } = this.getRightChild(i) as Locator<K | [K, V]>;

        if (rightChildElement && this.compare(
          Array.isArray(rightChildElement) ? rightChildElement[0] : rightChildElement,
          Array.isArray(leastChildElement) ? leastChildElement[0] : leastChildElement,
        ) === ComparisonResult.LESS) {
          leastChildElement = rightChildElement;
          leastChildIndex = rightChildIndex;
        }
      }

      const parentElement = this.structure.arr[i].element;

      if (this.compare(
        Array.isArray(parentElement) ? parentElement[0] : parentElement,
        Array.isArray(leastChildElement) ? leastChildElement[0] : leastChildElement,
      ) === ComparisonResult.GREATER) {
        this.swap(i, leastChildIndex);
        this.downheap(leastChildIndex);
      }
    }
  }

  /**
   * @override IStack
   * @returns Locator of the element.
   */
  enqueue(element: K | [K, V]): Locator<K | [K, V]> {
    const locator = new Locator(element, this.length);

    this.structure.arr.push(locator);
    this.upheap(this.length - 1);

    return locator;
  }

  getFirst(): K | [K, V] {
    if (this.isEmpty()) throw new ADSError('Queue is empty');

    return this.structure.arr[0].element;
  }

  /**
   * Gets left child of the specified element.
   *
   * @protected
   * @param i Element index in the array.
   * @returns Locator of the left child or undefined if left child does not exist.
   */
  protected getLeftChild(i: number): Locator<K | [K, V]> | undefined {
    return this.structure.arr[i * 2 + 1];
  }

  /**
   * Gets parent of the specified element.
   *
   * @protected
   * @param i Element index in the array.
   * @returns Locator of the parent or undefined if parent does not exist.
   */
  protected getParent(i: number): Locator<K | [K, V]> | undefined {
    return this.structure.arr[Math.floor((i - 1) / 2)];
  }

  /**
   * Gets right child of the specified element.
   *
   * @protected
   * @param i Element index in the array.
   * @returns Locator of the right child or undefined if right child does not exist.
   */
  protected getRightChild(i: number): Locator<K | [K, V]> | undefined {
    return this.structure.arr[i * 2 + 2];
  }

  /**
   * Checks whether the specified element has left child.
   *
   * @protected
   * @param i Element index in the array.
   * @returns TRUE if left child exists, FALSE otherwise.
   */
  protected hasLeftChild(i: number): boolean {
    return i * 2 + 1 < this.length;
  }

  /**
   * Checks whether the specified element has right child.
   *
   * @protected
   * @param i Element index in the array.
   * @returns TRUE if right child exists, FALSE otherwise.
   */
  protected hasRightChild(i: number): boolean {
    return i * 2 + 2 < this.length;
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
      this.structure.arr[elementIndex] !== locator) throw new ADSError('Locator is not valid.');
    else if (elementIndex === this.length - 1) this.structure.arr.pop();
    else {
      this.swap(elementIndex, this.length - 1);
      this.structure.arr.pop();
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
    const element = this.structure.arr[i];

    this.structure.arr[i]._internal.index = j;
    this.structure.arr[i] = this.structure.arr[j];
    this.structure.arr[j]._internal.index = i;
    this.structure.arr[j] = element;
  }

  /**
   * Performs up-heap bubbling for the specified element.
   *
   * @protected
   * @param i Element index in the array.
   */
  protected upheap(i: number) {
    if (!i) return;

    const { element: parent, index: parentIndex } = this.getParent(i) as Locator<K | [K, V]>;
    const child = this.structure.arr[i].element;

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
      this.structure.arr[elementIndex] !== locator) throw new ADSError('Locator is not valid.');
    locator._internal.element = element;
    this.bubble(elementIndex);
  }

}
