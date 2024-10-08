import {
  BatchResponse,
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import {
  AdminProduct,
  AdminProductOption,
  AdminProductVariant,
  AdminProductVariantInventoryLink,
} from "./entitites"
import { AdminInventoryItem } from "../../inventory"

export interface AdminProductResponse {
  product: AdminProduct
}

export type AdminProductListResponse = PaginatedResponse<{
  products: AdminProduct[]
}>

export interface AdminProductDeleteResponse extends DeleteResponse<"product"> {}

export interface AdminBatchProductResponse
  extends BatchResponse<AdminProduct> {}

export interface AdminProductVariantResponse {
  variant: AdminProductVariant
}

export type AdminProductVariantListResponse = PaginatedResponse<{
  variants: AdminProductVariant[]
}>

export interface AdminProductVariantDeleteResponse
  extends DeleteResponseWithParent<"variant", AdminProduct> {}

export interface AdminExportProductResponse {
  transaction_id: string
}

export interface AdminImportProductResponse {
  transaction_id: string
  summary: {
    toCreate: number
    toUpdate: number
  }
}

export interface AdminBatchProductVariantResponse
  extends BatchResponse<AdminProductVariant> {}

export interface AdminBatchProductVariantInventoryItemResponse
  extends BatchResponse<AdminInventoryItem> {}

export interface AdminProductOptionResponse {
  product_option: AdminProductOption
}

export type AdminProductOptionListResponse = PaginatedResponse<{
  product_options: AdminProductOption[]
}>

export interface AdminProductOptionDeleteResponse
  extends DeleteResponseWithParent<"product_option", AdminProduct> {}

export type AdminProductVariantInventoryResponse =
  | AdminProductVariantInventoryLink
  | AdminProductVariantInventoryLink[]

export interface AdminProductVariantInventoryBatchResponse {
  created: AdminProductVariantInventoryResponse
  updated: AdminProductVariantInventoryResponse
  deleted: AdminProductVariantInventoryResponse
}

export interface AdminProductVariantInventoryLinkDeleteResponse {
  id: AdminProductVariantInventoryLink
  object: "variant-inventory-item-link"
  deleted: boolean
  parent: AdminProductVariant
}
