/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

/**
 * The list of sales channel.
 */
export interface AdminPublishableApiKeysListSalesChannelsRes {
  /**
   * An array of sales channels details.
   */
  sales_channels: Array<SalesChannel>
}
