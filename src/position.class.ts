import { IContainer } from './container.interface';

/**
 * Represents the location of one element in a linked data structure.
 *
 * @template T Type of elements stored in the data structure this position points to.
 */
export class Position<T, N extends IContainer<T>> implements IContainer<T> {

  /**
   * Element at this position.
   *
   * @readonly
   */
  get element() {
    return this.node.element;
  }

  /**
   * Position data for in-package usage. DO NOT use this field in your client code.
   *
   * @readonly
   */
  get _internal() {
    return { node: this.node, container: this.container };
  }

  /**
   * Creates an instance of Position.
   *
   * @param node Node of the data structure storing the element.
   * @param container Reference to the instance of a data structure this position relates to.
   */
  constructor(protected node: N, protected container: {}) { }

}
