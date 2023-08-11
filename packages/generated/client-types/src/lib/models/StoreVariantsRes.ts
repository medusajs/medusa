/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

export interface StoreVariantsRes {
  /**
   * Product variant description.
   */
  variant: SetRelation<
    PricedVariant,
    "prices" | "options" | "product" | "purchasable"
  >
}
