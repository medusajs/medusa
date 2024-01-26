/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPriceListDeleteVariantPricesRes {
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
