/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductCategory } from "./ProductCategory"

/**
 * The list of product categories with pagination fields.
 */
export interface StoreGetProductCategoriesRes {
  /**
   * An array of product categories details.
   */
  product_categories: Array<
    SetRelation<ProductCategory, "category_children" | "parent_category">
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of product categories skipped when retrieving the product categories.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
