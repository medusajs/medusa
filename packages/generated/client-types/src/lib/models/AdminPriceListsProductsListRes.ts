/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductVariant } from "./ProductVariant"

export interface AdminPriceListsProductsListRes {
  products: Array<
    Merge<
      SetRelation<
        Product,
        | "categories"
        | "collection"
        | "images"
        | "options"
        | "tags"
        | "type"
        | "variants"
      >,
      {
        variants: Array<SetRelation<ProductVariant, "options">>
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
