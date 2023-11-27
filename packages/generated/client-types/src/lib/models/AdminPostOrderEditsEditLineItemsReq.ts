/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrderEditsEditLineItemsReq {
  /**
   * The ID of the product variant associated with the item.
   */
  variant_id: string
  /**
   * The quantity of the item.
   */
  quantity: number
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
