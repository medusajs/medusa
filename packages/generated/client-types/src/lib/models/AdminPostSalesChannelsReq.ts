/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the sales channel to create.
 */
export interface AdminPostSalesChannelsReq {
  /**
   * The name of the Sales Channel
   */
  name: string
  /**
   * The description of the Sales Channel
   */
  description?: string
  /**
   * Whether the Sales Channel is disabled.
   */
  is_disabled?: boolean
}
