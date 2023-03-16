/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { Product } from "./Product"

export interface AdminProductsListRes {
  products: Array<Product | PricedProduct>
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
