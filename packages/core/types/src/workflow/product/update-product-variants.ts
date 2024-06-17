export interface UpsertProductVariantPricesInputDTO {
  id?: string
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export interface UpsertProductVariantOptionInputDTO {
  value: string
  option_id: string
}

export interface UpdateProductVariantsInputDTO {
  id: string
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

export interface UpdateProductVariantsWorkflowInputDTO {
  productVariants: UpdateProductVariantsInputDTO[]
}
