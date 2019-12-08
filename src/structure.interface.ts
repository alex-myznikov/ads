/**
 * Interface of a data structure common behaviour.
 */
export interface IStructure {

  /**
   * Number of elements in the structure.
   *
   * @readonly
   */
   length: number;

   /**
    * Clears the structure.
    */
   clear(): void;

   /**
    * Checks whether the structure is empty or not.
    *
    * @returns TRUE if the structure is empty, FALSE otherwise.
    */
   isEmpty(): boolean;

}
