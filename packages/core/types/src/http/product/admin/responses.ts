import {
  BatchResponse,
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import {
  AdminProduct,
  AdminProductOption,
  AdminProductOptionValue,
  AdminProductVariant,
  AdminProductVariantInventoryLink,
} from "./entitites"
import { AdminInventoryItem } from "../../inventory"

export interface AdminProductResponse {
  /**
   * The product's details.
   */
  product: AdminProduct
}

export type AdminProductListResponse = PaginatedResponse<{
  /**
   * The list of products.
   */
  products: AdminProduct[]
}>

export interface AdminProductDeleteResponse extends DeleteResponse<"product"> {}

export interface AdminBatchProductResponse
  extends BatchResponse<AdminProduct> {}

export interface AdminProductVariantResponse {
  variant: AdminProductVariant
}

export type AdminProductVariantListResponse = PaginatedResponse<{
  /**
   * The list of product variants.
   */
  variants: AdminProductVariant[]
}>

export interface AdminProductVariantDeleteResponse
  extends DeleteResponseWithParent<"variant", AdminProduct> {}

export interface AdminExportProductResponse {
  /**
   * The ID of the export product workflow's transaction.
   */
  transaction_id: string
}

export interface AdminImportProductResponse {
  /**
   * The ID of the import product workflow execution's transaction.
   * This is useful to confirm the import using the `/admin/products/:transaction-id/import` API route.
   */
  transaction_id: string
  /**
   * Details of the products to create or update when the import is confirmed.
   */
  summary: {
    /**
     * The number of products that will be created by the import.
     */
    toCreate: number
    /**
     * The number of products that will be updated by the import.
     */
    toUpdate: number
  }
}

export interface AdminImportProductsResponse
  extends AdminImportProductResponse {}

export interface AdminBatchProductVariantResponse
  extends BatchResponse<AdminProductVariant> {}

export interface AdminBatchProductVariantInventoryItemResponse
  extends BatchResponse<AdminInventoryItem> {}

export interface AdminProductOptionResponse {
  /**
   * The product option's details.
   */
  product_option: AdminProductOption
}

export type AdminProductOptionListResponse = PaginatedResponse<{
  /**
   * The list of product options.
   */
  product_options: AdminProductOption[]
}>

export interface AdminProductOptionDeleteResponse
  extends DeleteResponseWithParent<"product_option", AdminProduct> {}

export interface AdminProductOptionValueResponse {
  /**
   * The product option value's details.
   */
  product_option_value: AdminProductOptionValue
}

export type AdminProductOptionValueListResponse = PaginatedResponse<{
  /**
   * The list of product option values.
   */
  product_option_values: AdminProductOptionValue[]
}>

export interface AdminProductOptionValueDeleteResponse
  extends DeleteResponseWithParent<
    "product_option_value",
    AdminProductOption
  > {}

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

export interface AdminBatchImageVariantResponse {
  /**
   * The variant IDs that were added to the image.
   */
  added: string[]
  /**
   * The variant IDs that were removed from the image.
   */
  removed: string[]
}

export interface AdminBatchVariantImagesResponse {
  /**
   * The image IDs that were added to the variant.
   */
  added: string[]
  /**
   * The image IDs that were removed from the variant.
   */
  removed: string[]
}
