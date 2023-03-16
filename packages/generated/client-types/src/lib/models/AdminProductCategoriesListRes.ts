/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductCategory } from "./ProductCategory"

export interface AdminProductCategoriesListRes {
  product_categories: Array<ProductCategory>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
