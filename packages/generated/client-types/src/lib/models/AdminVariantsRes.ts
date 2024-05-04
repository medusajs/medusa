/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

/**
 * The product variant's details.
 */
export interface AdminVariantsRes {
  /**
   * Product variant's details.
   */
  variant: SetRelation<PricedVariant, "options" | "prices" | "product">
}
