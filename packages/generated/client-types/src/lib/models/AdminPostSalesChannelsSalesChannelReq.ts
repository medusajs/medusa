/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details to update of the sales channel.
 */
export interface AdminPostSalesChannelsSalesChannelReq {
  /**
   * The name of the sales channel
   */
  name?: string
  /**
   * The description of the sales channel.
   */
  description?: string
  /**
   * Whether the Sales Channel is disabled.
   */
  is_disabled?: boolean
}
