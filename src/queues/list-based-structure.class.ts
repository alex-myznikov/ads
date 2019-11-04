import { LinkedListAbstract } from '../lists/linked-list.class';
import { IContainer } from 'src/container.interface';

/**
 * Provides implementation of the common behaviour for linked list based stacks and queues.
 */
export abstract class ListBasedStructureCommonAbstract<T> {

  /**
   * Reference to the underlying linked list data structure.
   *
   * @protected
   */
  protected abstract list: LinkedListAbstract<T, IContainer<T>>;

  get length() {
    return this.list.length;
  }

  clear() {
    this.list.clear();
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }

}
