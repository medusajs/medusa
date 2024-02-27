/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

/**
 * The list of sales channels with pagination fields.
 */
export interface AdminSalesChannelsListRes {
  /**
   * An array of sales channels details.
   */
  sales_channels: Array<SalesChannel>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of items skipped before the returned results
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
