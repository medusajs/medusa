/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { ProductVariant } from "./ProductVariant"

export interface AdminProductsDeleteOptionRes {
  /**
   * The ID of the deleted Product Option
   */
  option_id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the items were deleted.
   */
  deleted: boolean
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
