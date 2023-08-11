/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteSalesChannelsChannelProductsBatchReq {
  /**
   * The IDs of the products to remove from the Sales Channel.
   */
  product_ids: Array<{
    /**
     * The ID of a product
     */
    id: string
  }>
}
