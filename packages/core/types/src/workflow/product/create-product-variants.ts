import {
  UpsertProductVariantOptionInputDTO,
  UpsertProductVariantPricesInputDTO,
} from "./update-product-variants"

export interface CreateProductVariantsInputDTO {
  product_id?: string
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

  prices?: UpsertProductVariantPricesInputDTO[]
  options?: UpsertProductVariantOptionInputDTO[]
}

export interface CreateProductVariantsWorkflowInputDTO {
  productVariants: CreateProductVariantsInputDTO[]
}
