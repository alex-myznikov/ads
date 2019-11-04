import { IContainer } from './container.interface';

/**
 * Represents the placement of a single element in array data structure.
 */
export class Locator<T> implements IContainer<T> {

  /**
   * Element represented by this locator.
   *
   * @readonly
   */
  get element() {
    return this._element;
  }

  /**
   * Locator data for in-package usage. DO NOT use this field in your client code.
   *
   * @readonly
   */
  get _internal() {
    return { element: this._element };
  }

  /**
   * Creates an instance of Position.
   *
   * @param _element Reference to the element.
   * @param index Index of the element in its containing array.
   */
  constructor(protected _element: T, public index: number) { }

}
