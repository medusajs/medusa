/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the sales channels to remove from the publishable API key.
 */
export interface AdminDeletePublishableApiKeySalesChannelsBatchReq {
  /**
   * The IDs of the sales channels to remove from the publishable API key
   */
  sales_channel_ids: Array<{
    /**
     * The ID of the sales channel
     */
    id: string
  }>
}
