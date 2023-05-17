export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

/**
 * DTO in and out of the module (module API)
 */

export interface ProductDTO {
  id: string
  title: string
  handle?: string | null
  subtitle?: string | null
  description?: string | null
  is_giftcard: boolean
  status: ProductStatus
  thumbnail?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  origin_country?: string | null
  hs_code?: string | null
  mid_code?: string | null
  material?: string | null
  // TODO
  collection?: any
  // TODO
  categories?: any
  // TODO
  type: any
  // TODO
  tags: any
  // TODO
  //variants: any
  options: ProductOptionDTO[]
  discountable?: boolean
  external_id?: string | null
  created_at?: string | Date
  updated_at?: string | Date
  deleted_at?: string | Date
}

export interface ProductVariantDTO {
  id: string
  title: string
  sku?: string | null
  barcode?: string | null
  ean?: string | null
  upc?: string | null
  inventory_quantity: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string | null
  origin_country?: string | null
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  options: ProductOptionValueDTO
  metadata?: Record<string, unknown> | null
  product: ProductDTO
  variant_rank?: number | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

export interface ProductTagDTO {
  id: string
}

export interface ProductVariantDTO {
  id: string
}

export interface ProductCollectionDTO {
  id: string
}

export interface ProductOptionDTO {
  id: string
  title: string
  product: ProductDTO
  values: ProductOptionValueDTO
  metadata?: Record<string, unknown> | null
}

export interface ProductOptionValueDTO {
  id: string
  value: string
  option: ProductOptionDTO
  variant: ProductVariantDTO
  metadata?: Record<string, unknown> | null
}

/**
 * Filters/Config (module API input filters and config)
 */
export interface FilterableProductProps {
  id?: string | string[]
  tags?: { value?: string[] }
  categories?: { id?: string[] }
}

export interface FilterableProductTagProps {
  id?: string | string[]
  value?: string
}

export interface FilterableProductCollectionProps {
  id?: string | string[]
  title?: string
}
export interface FilterableProductVariantProps {
  id?: string | string[]
  sku?: string
  options?: { id?: string[] }
}
