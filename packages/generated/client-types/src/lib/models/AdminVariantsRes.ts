/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

export interface AdminVariantsRes {
  /**
   * Product variant's details.
   */
  variant: SetRelation<PricedVariant, "options" | "prices" | "product">
}
