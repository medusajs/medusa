import { AdminProductCategory } from "../product-category"
import {
  BaseProduct,
  BaseProductCategoryFilters,
  BaseProductFilters,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionFilters,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductTagFilters,
  BaseProductType,
  BaseProductTypeFilters,
  BaseProductVariant,
  BaseProductVariantFilters,
} from "./common"

export interface AdminProduct extends Omit<BaseProduct, "categories"> {
  categories?: AdminProductCategory[]
}

export interface AdminProductVariant extends BaseProductVariant {}
export interface AdminProductTag extends BaseProductTag {}
export interface AdminProductType extends BaseProductType {}
export interface AdminProductOption extends BaseProductOption {}
export interface AdminProductImage extends BaseProductImage {}
export interface AdminProductOptionValue extends BaseProductOptionValue {}

export interface AdminProductFilters extends BaseProductFilters {}
export interface AdminProductTagFilters extends BaseProductTagFilters {}
export interface AdminProductTypeFilters extends BaseProductTypeFilters {}
export interface AdminProductOptionFilters extends BaseProductOptionFilters {}
export interface AdminProductVariantFilters extends BaseProductVariantFilters {}
export interface AdminProductCategoryFilters
  extends BaseProductCategoryFilters {}

export interface AdminCreateProductVariantPrice {
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
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
  metadata?: Record<string, any>
  prices: AdminCreateProductVariantPrice[]
  options?: Record<string, any>
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
  status?: string
  type_id?: string | null
  collection_id?: string | null
  categories?: { id: string }[]
  tags?: { id?: string; value?: string }[]
  options?: { title?: string; values?: string[] }[]
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
  metadata?: Record<string, any>
}
