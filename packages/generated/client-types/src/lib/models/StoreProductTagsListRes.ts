/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductTag } from "./ProductTag"

/**
 * The list of product tags with pagination fields.
 */
export interface StoreProductTagsListRes {
  /**
   * An array of product tags details.
   */
  product_tags: Array<ProductTag>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of product tags skipped when retrieving the product tags.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
