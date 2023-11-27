/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

/**
 * The sales channel's details.
 */
export interface AdminSalesChannelsRes {
  /**
   * Sales Channel's details.
   */
  sales_channel: SalesChannel
}
