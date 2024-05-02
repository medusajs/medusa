/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { ProductVariant } from "./ProductVariant"

/**
 * The product's details.
 */
export interface AdminProductsRes {
  /**
   * Product details.
   */
  product: Merge<
    SetRelation<
      PricedProduct,
      "collection" | "images" | "options" | "tags" | "type" | "variants"
    >,
    {
      variants: Array<SetRelation<ProductVariant, "options" | "prices">>
    }
  >
}
