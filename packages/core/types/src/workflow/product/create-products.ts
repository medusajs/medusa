import { ProductStatus } from "../../product"

export interface CreateProductTypeInputDTO {
  id?: string
  value: string
}

export interface CreateProductTagInputDTO {
  id?: string
  value: string
}

export interface CreateProductSalesChannelInputDTO {
  id: string
}

export interface CreateProductProductCategoryInputDTO {
  id: string
}

export interface CreateProductOptionInputDTO {
  title: string
}

export interface CreateProductVariantPricesInputDTO {
  id?: string
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export interface CreteProductVariantOptionInputDTO {
  value: string
  option_id: string
}

export interface CreateProductVariantInputDTO {
  id?: string
  title?: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
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

  prices?: CreateProductVariantPricesInputDTO[]
  options?: CreteProductVariantOptionInputDTO[]
}

export interface CreateProductInputDTO {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductTypeInputDTO
  collection_id?: string
  tags?: CreateProductTagInputDTO[]
  categories?: CreateProductProductCategoryInputDTO[]
  options?: CreateProductOptionInputDTO[]
  variants?: CreateProductVariantInputDTO[]
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>

  sales_channels?: CreateProductSalesChannelInputDTO[]
}

export interface CreateProductsWorkflowInputDTO {
  products: CreateProductInputDTO[]
}
