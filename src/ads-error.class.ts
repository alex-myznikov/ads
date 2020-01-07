/**
 * Class for exceptions raised by this package.
 */
export class ADSError extends Error {

  /**
   * Creates an instance of ADSError.
   *
   * @param message Error message.
   */
  constructor(
    public message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, Object.assign(ADSError.prototype, { name: 'ADSError' }));
  }

}
