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
  get element(): T {
    return this._element;
  }

  /**
   * Index of the element in its containing array.
   *
   * @readonly
   */
  get index(): number {
    return this._index;
  }

  /**
   * Locator data for in-package usage. DO NOT use this field in your client code.
   *
   * @readonly
   */
  get _internal() {
    const self = this;

    return {
      set element(value: T) {
        self._element = value;
      },
      set index(value: number) {
        self._index = value;
      },
    };
  }

  /**
   * Creates an instance of Locator.
   *
   * @param _element Reference to the element.
   * @param _index Index of the element in its containing array.
   */
  constructor(protected _element: T, protected _index: number) { }

}
