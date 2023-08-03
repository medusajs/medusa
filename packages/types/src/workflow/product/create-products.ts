// TODO: this file, should we re think the naming

import { ProductStatus } from "../../product"

export interface ProductTypeReq {
  id?: string
  value: string
}

export interface ProductTagReq {
  id?: string
  value: string
}

export interface ProductSalesChannelReq {
  id: string
}

export interface ProductProductCategoryReq {
  id: string
}

export interface ProductOptionReq {
  title: string
}

export interface ProductVariantPricesReq {
  id?: string
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export interface ProductVariantOptionReq {
  value: string
  option_id: string
}

export interface ProductVariantReq {
  id?: string
  title?: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>

  prices?: ProductVariantPricesReq[]
  options?: ProductVariantOptionReq[]
}

export interface AdminPostProductsReq {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: ProductTypeReq
  collection_id?: string
  tags?: ProductTagReq[]
  sales_channels?: ProductSalesChannelReq[]
  categories?: ProductProductCategoryReq[]
  options?: ProductOptionReq[]
  variants?: ProductVariantReq[]
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
}
