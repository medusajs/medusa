/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

export interface StoreRegionsRes {
  /**
   * Region details.
   */
  region: SetRelation<
    Region,
    "countries" | "payment_providers" | "fulfillment_providers"
  >
}
