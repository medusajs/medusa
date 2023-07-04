/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

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
   * Whether the Sales Channel is disabled or not.
   */
  is_disabled?: boolean
}
