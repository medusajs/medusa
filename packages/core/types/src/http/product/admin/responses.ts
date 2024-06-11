import { BatchMethodResponse } from "../../../common"
import { DeleteResponse, PaginatedResponse } from "../../common"
import {
  AdminProduct,
  AdminProductOption,
  AdminProductVariant,
} from "./entitites"

export interface AdminProductResponse {
  product: AdminProduct
}

export type AdminProductListResponse = PaginatedResponse<{
  products: AdminProduct[]
}>

export interface AdminProductDeleteResponse extends DeleteResponse<"product"> {}

export interface AdminBatchProductResponse
  extends BatchMethodResponse<AdminProduct> {}

export interface AdminProductVariantResponse {
  variant: AdminProductVariant
}

export type AdminProductVariantListResponse = PaginatedResponse<{
  variants: AdminProductVariant[]
}>

export interface AdminProductVariantDeleteResponse
  extends DeleteResponse<"variant", AdminProduct> {}

export interface AdminBatchProductVariantResponse
  extends BatchMethodResponse<AdminProductVariant> {}

export interface AdminProductOptionResponse {
  product_option: AdminProductOption
}

export type AdminProductOptionListResponse = PaginatedResponse<{
  product_options: AdminProductOption[]
}>

export interface AdminProductOptionDeleteResponse
  extends DeleteResponse<"product_option", AdminProduct> {}
