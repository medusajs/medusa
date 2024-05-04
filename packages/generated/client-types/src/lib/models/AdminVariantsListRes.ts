/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

/**
 * The list of variants with pagination fields.
 */
export interface AdminVariantsListRes {
  /**
   * An array of product variant details.
   */
  variants: Array<
    SetRelation<PricedVariant, "options" | "prices" | "product" | "purchasable">
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of product variants skipped when retrieving the product variants.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
