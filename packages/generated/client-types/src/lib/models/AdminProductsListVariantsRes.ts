/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductVariant } from "./ProductVariant"

export interface AdminProductsListVariantsRes {
  /**
   * An array of product variants details.
   */
  variants: Array<ProductVariant>
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
