/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

export interface AdminPublishableApiKeysListSalesChannelsRes {
  /**
   * An array of sales channels details.
   */
  sales_channels: Array<SalesChannel>
}
