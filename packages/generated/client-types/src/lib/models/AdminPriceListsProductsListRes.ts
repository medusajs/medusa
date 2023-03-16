/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"

export interface AdminPriceListsProductsListRes {
  products: Array<Product>
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
