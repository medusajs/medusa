/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the products to remove from the collection.
 */
export interface AdminDeleteProductsFromCollectionReq {
  /**
   * An array of Product IDs to remove from the Product Collection.
   */
  product_ids: Array<string>
}
