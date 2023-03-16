/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { ProductVariant } from "./ProductVariant"

export interface AdminProductsListRes {
  products: Array<
    Merge<
      SetRelation<
        PricedProduct,
        "collection" | "images" | "options" | "tags" | "type" | "variants"
      >,
      {
        variants: Array<SetRelation<ProductVariant, "options" | "prices">>
      }
    >
  >
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
