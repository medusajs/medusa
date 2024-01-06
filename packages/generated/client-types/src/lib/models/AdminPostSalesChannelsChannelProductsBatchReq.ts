/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the products to add to the sales channel.
 */
export interface AdminPostSalesChannelsChannelProductsBatchReq {
  /**
   * The IDs of the products to add to the sales channel
   */
  product_ids: Array<{
    /**
     * The ID of the product
     */
    id: string
  }>
}
