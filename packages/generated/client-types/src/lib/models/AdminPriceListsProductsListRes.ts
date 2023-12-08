/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductVariant } from "./ProductVariant"

/**
 * The list of products with pagination fields.
 */
export interface AdminPriceListsProductsListRes {
  /**
   * An array of products details.
   */
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
   * The number of price lists skipped when retrieving the price lists.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
