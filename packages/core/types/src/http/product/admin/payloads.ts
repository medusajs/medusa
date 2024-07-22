import { BatchMethodRequest } from "../../../common"
import { ProductStatus } from "../common"

export interface AdminExportProductRequest {}
export interface AdminBatchProductRequest
  extends BatchMethodRequest<AdminCreateProduct, AdminUpdateProduct> {}

export interface AdminBatchProductVariantRequest
  extends BatchMethodRequest<
    AdminCreateProductVariant,
    AdminUpdateProductVariant
  > {}

export interface AdminBatchProductVariantInventoryItemRequest
  extends BatchMethodRequest<
    AdminCreateProductVariantInventoryItem,
    AdminUpdateProductVariantInventoryItem,
    AdminDeleteProductVariantInventoryItem
  > {}

export interface AdminCreateProductVariantPrice {
  currency_code: string
  amount: number
  min_quantity?: number | null
  max_quantity?: number | null
  // Note: Although the BE is generic, we only use region_id for price rules for now, so it's better to keep the typings stricter.
  rules?: { region_id: string } | null
}

export interface AdminCreateProductVariant {
  title: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
  mid_code?: string
  allow_backorder?: boolean
  manage_inventory?: boolean
  variant_rank?: number
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  material?: string
  metadata?: Record<string, unknown>
  prices: AdminCreateProductVariantPrice[]
  options?: Record<string, string>
}

export interface AdminCreateProduct {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: { url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type_id?: string
  collection_id?: string
  categories?: { id: string }[]
  tags?: { id?: string; value?: string }[]
  options?: AdminCreateProductOption[]
  variants?: AdminCreateProductVariant[]
  sales_channels?: { id: string }[]
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  mid_code?: string
  origin_country?: string
  material?: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateProductVariant {
  title?: string
  sku?: string | null
  ean?: string | null
  upc?: string | null
  barcode?: string | null
  hs_code?: string | null
  mid_code?: string | null
  allow_backorder?: boolean
  manage_inventory?: boolean
  variant_rank?: number
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  origin_country?: string | null
  material?: string | null
  metadata?: Record<string, unknown> | null
  prices?: AdminCreateProductVariantPrice[]
  options?: Record<string, string>
}

export interface AdminUpdateProduct {
  title?: string
  subtitle?: string | null
  description?: string | null
  is_giftcard?: boolean
  discountable?: boolean
  images?: { url: string }[]
  thumbnail?: string | null
  handle?: string
  status?: ProductStatus
  type_id?: string | null
  collection_id?: string | null
  categories?: { id: string }[]
  tags?: { id?: string; value?: string }[]
  options?: AdminUpdateProductOption[]
  variants?: AdminCreateProductVariant[]
  sales_channels?: { id: string }[]
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  hs_code?: string | null
  mid_code?: string | null
  origin_country?: string | null
  material?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateProductOption {
  title: string
  values: string[]
}

export interface AdminUpdateProductOption {
  title?: string
  values?: string[]
}

interface AdminCreateProductVariantInventoryItem {
  required_quantity: number
  inventory_item_id: string
  variant_id: string
}

interface AdminUpdateProductVariantInventoryItem {
  required_quantity: number
  inventory_item_id: string
  variant_id: string
}

interface AdminDeleteProductVariantInventoryItem {
  inventory_item_id: string
  variant_id: string
}
