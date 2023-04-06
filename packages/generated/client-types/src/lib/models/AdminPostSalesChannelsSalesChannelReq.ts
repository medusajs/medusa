/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostSalesChannelsSalesChannelReq {
  /**
   * Name of the sales channel.
   */
  name?: string
  /**
   * Sales Channel description.
   */
  description?: string
  /**
   * Indication of if the sales channel is active.
   */
  is_disabled?: boolean
}
