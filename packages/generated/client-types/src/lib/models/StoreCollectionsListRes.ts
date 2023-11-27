/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductCollection } from "./ProductCollection"

/**
 * The list of product collections with pagination fields.
 */
export interface StoreCollectionsListRes {
  /**
   * An array of product collections details
   */
  collections: Array<ProductCollection>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of product collections skipped when retrieving the product collections.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
