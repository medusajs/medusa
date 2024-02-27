/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of deleting a price list.
 */
export interface AdminPriceListDeleteBatchRes {
  /**
   * The IDs of the deleted prices.
   */
  ids: Array<string>
  /**
   * The type of the object that was deleted. A price is also named `money-amount`.
   */
  object: string
  /**
   * Whether or not the items were deleted.
   */
  deleted: boolean
}
