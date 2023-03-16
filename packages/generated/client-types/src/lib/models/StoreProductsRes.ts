/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedProduct } from "./PricedProduct"
import type { ProductOption } from "./ProductOption"
import type { ProductVariant } from "./ProductVariant"

export interface StoreProductsRes {
  product: Merge<
    SetRelation<
      PricedProduct,
      "collection" | "images" | "options" | "tags" | "type" | "variants"
    >,
    {
      options: Array<SetRelation<ProductOption, "values">>
      variants: Array<SetRelation<ProductVariant, "options" | "prices">>
    }
  >
}
