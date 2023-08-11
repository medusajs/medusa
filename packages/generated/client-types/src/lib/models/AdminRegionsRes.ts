/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

export interface AdminRegionsRes {
  /**
   * Region details.
   */
  region: SetRelation<
    Region,
    "countries" | "fulfillment_providers" | "payment_providers"
  >
}
