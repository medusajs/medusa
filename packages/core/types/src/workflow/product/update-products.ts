import { ProductStatus } from "../../product"

export interface UpdateProductTypeInputDTO {
  id?: string
  value: string
}

export interface UpdateProductTagInputDTO {
  id?: string
  value: string
}

export interface UpdateProductSalesChannelInputDTO {
  id: string
}

export interface UpdateProductProductCategoryInputDTO {
  id: string
}

export interface UpdateProductVariantPricesInputDTO {
  id?: string
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export interface UpdateProductVariantOptionInputDTO {
  value: string
  option_id: string
}

export interface UpdateProductVariantInputDTO {
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

  prices?: UpdateProductVariantPricesInputDTO[]
  options?: UpdateProductVariantOptionInputDTO[]
}

export interface UpdateProductInputDTO {
  id: string
  title?: string
  subtitle?: string
  description?: string
  discountable?: boolean
  images?: string[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: UpdateProductTypeInputDTO
  collection_id?: string
  tags?: UpdateProductTagInputDTO[]
  sales_channels?: UpdateProductSalesChannelInputDTO[]
  categories?: UpdateProductProductCategoryInputDTO[]
  variants?: UpdateProductVariantInputDTO[]
  weight?: number
  length?: number
  width?: number
  height?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
}

export interface UpdateProductsWorkflowInputDTO {
  products: UpdateProductInputDTO[]
}
