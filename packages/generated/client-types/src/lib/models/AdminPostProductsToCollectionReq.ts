/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductsToCollectionReq {
  /**
   * An array of Product IDs to add to the Product Collection.
   */
  product_ids: Array<string>
}
