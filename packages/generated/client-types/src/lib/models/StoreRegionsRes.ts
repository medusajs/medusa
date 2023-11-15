/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

/**
 * The region's details.
 */
export interface StoreRegionsRes {
  /**
   * Region details.
   */
  region: SetRelation<
    Region,
    "countries" | "payment_providers" | "fulfillment_providers"
  >
}
