/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteProductsFromCollectionRes {
  /**
   * The ID of the collection
   */
  id: string
  /**
   * The type of object the removal was executed on
   */
  object: string
  /**
   * The IDs of the products removed from the collection
   */
  removed_products: Array<string>
}
