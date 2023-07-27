/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostCartsCartLineItemsItemReq {
  /**
   * The quantity of the line item in the cart.
   */
  quantity: number
  /**
   * An optional key-value map with additional details about the Line Item. If omitted, the metadata will remain unchanged."
   */
  metadata?: Record<string, any>
}
