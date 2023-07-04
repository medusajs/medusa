/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostCartReq {
  /**
   * The ID of the Region to create the Cart in.
   */
  region_id?: string
  /**
   * [EXPERIMENTAL] The ID of the Sales channel to create the Cart in.
   */
  sales_channel_id?: string
  /**
   * The 2 character ISO country code to create the Cart in.
   */
  country_code?: string
  /**
   * An optional array of `variant_id`, `quantity` pairs to generate Line Items from.
   */
  items?: Array<{
    /**
     * The id of the Product Variant to generate a Line Item from.
     */
    variant_id: string
    /**
     * The quantity of the Product Variant to add
     */
    quantity: number
  }>
  /**
   * An optional object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`
   */
  context?: Record<string, any>
}
