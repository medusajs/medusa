import { ProductUtils } from "@medusajs/utils"
import { ProductTypes } from "@medusajs/types"

export type ProductEventData = {
  id: string
}

export enum ProductEvents {
  PRODUCT_UPDATED = "product.updated",
  PRODUCT_CREATED = "product.created",
  PRODUCT_DELETED = "product.deleted",
}

export interface UpdateProductDTO {
  id: string
  title?: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductUtils.ProductStatus
  collection_id?: string
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
  tags?: { id: string }[]
  categories?: { id: string }[]
  type_id?: string
}

export interface CreateProductVariantOptionDTO {
  value: string
}

export interface CreateProductOnlyDTO {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductTypes.ProductStatus
  collection_id?: string
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
  tags?: { id: string }[]
  categories?: { id: string }[]
  type_id?: string
}

export interface CreateProductVariantOnlyDTO {
  title: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: (CreateProductVariantOptionDTO & { option: any })[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductVariantOnlyDTO {
  id: string
  title?: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: (CreateProductVariantOptionDTO & { option: any })[]
  metadata?: Record<string, unknown>
}

export interface CreateProductOptionOnlyDTO {
  product_id?: string
  product?: Record<any, any>
  title: string
}
