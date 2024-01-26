/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { ProductOption } from "./ProductOption"
import type { ProductVariant } from "./ProductVariant"

/**
 * The list of products with pagination fields.
 */
export interface StoreProductsListRes {
  /**
   * An array of products details.
   */
  products: Array<
    Merge<
      SetRelation<
        PricedProduct,
        "collection" | "images" | "options" | "tags" | "type" | "variants"
      >,
      {
        options: Array<SetRelation<ProductOption, "values">>
        variants: Array<
          SetRelation<ProductVariant, "options" | "prices" | "purchasable">
        >
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of products skipped when retrieving the products.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
