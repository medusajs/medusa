import { CreateProductVariantOptionDTO } from "@medusajs/types"

export interface UpdateProductVariantDTO {
  id: string
  product_id: string
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
  options?: (CreateProductVariantOptionDTO & { id?: string })[]
  metadata?: Record<string, unknown>
}
