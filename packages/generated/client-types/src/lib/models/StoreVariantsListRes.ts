/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

/**
 * The list of product variants.
 */
export interface StoreVariantsListRes {
  /**
   * An array of product variant descriptions.
   */
  variants: Array<
    SetRelation<PricedVariant, "prices" | "options" | "product" | "purchasable">
  >
}
