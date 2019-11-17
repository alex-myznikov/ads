import { IContainer } from '../container.interface';
import { IStructure } from './structure.interface';
import { LinkedListAbstract } from '../lists/linked-list.class';

/**
 * Provides implementation of the common behaviour for linked list based stacks and queues.
 */
export class ListBasedStructure<T, L extends LinkedListAbstract<T, IContainer<T>>> implements IStructure {

  get length() {
    return this.list.length;
  }

  /**
   * Creates an instance of ListBasedStructure.
   *
   * @param list Reference to the underlying linked list data structure.
   */
  constructor(public list: L) { }

  clear() {
    this.list.clear();
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }

}
