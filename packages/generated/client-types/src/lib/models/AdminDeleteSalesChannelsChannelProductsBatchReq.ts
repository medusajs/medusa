/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the products to delete from the sales channel.
 */
export interface AdminDeleteSalesChannelsChannelProductsBatchReq {
  /**
   * The IDs of the products to remove from the sales channel.
   */
  product_ids: Array<{
    /**
     * The ID of a product
     */
    id: string
  }>
}
