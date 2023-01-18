/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminDeleteProductsFromCollectionRes = {
  /**
   * The ID of the collection
   */
  id?: string;
  /**
   * The type of object the removal was executed on
   */
  object?: string;
  /**
   * The IDs of the products removed from the collection
   */
  removed_products?: Array<string>;
};

