import { IContainer } from './container.interface';

/**
 * Represents the location of a single element in linked data structure.
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
   * Position metadata for in-package usage. DO NOT use this method in your client code.
   *
   * @readonly
   */
  get _meta() {
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
