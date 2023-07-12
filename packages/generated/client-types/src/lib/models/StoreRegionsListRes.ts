/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

export interface StoreRegionsListRes {
  regions: Array<
    SetRelation<
      Region,
      "countries" | "payment_providers" | "fulfillment_providers"
    >
  >
  /**
   * The total number of items available
   */
  count?: number
  /**
   * The number of items skipped before these items
   */
  offset?: number
  /**
   * The number of items per page
   */
  limit?: number
}
