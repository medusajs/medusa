import { PaginatedResponse } from "../../common"
import { StoreProduct, StoreProductOption, StoreProductVariant } from "../store"

export interface StoreProductResponse {
  /**
   * The product's details.
   */
  product: StoreProduct
}

export type StoreProductListResponse = PaginatedResponse<{
  /**
   * The list of products.
   */
  products: StoreProduct[]
}>

export interface StoreProductVariantResponse {
  /**
   * The product variant's details.
   */
  variant: StoreProductVariant
}

export type StoreProductVariantListResponse = PaginatedResponse<{
  /**
   * The list of product variants.
   */
  variants: StoreProductVariant[]
}>

export interface StoreProductOptionResponse {
  /**
   * The product option's details.
   */
  product_option: StoreProductOption
}

export type StoreProductOptionListResponse = PaginatedResponse<{
  /**
   * The list of product options.
   */
  product_options: StoreProductOption[]
}>
