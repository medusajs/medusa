import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

/**
 * DTO in and out of the module (module API)
 */

// TODO: This DTO should represent the product, when used in config we should use Partial<ProductDTO>, it means that some props like handle should be updated to not be optional
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
  collection: ProductCollectionDTO
  categories?: ProductCategoryDTO[] | null
  type: ProductTypeDTO[]
  tags: ProductTagDTO[]
  variants: ProductVariantDTO[]
  options: ProductOptionDTO[]
  images: ProductImageDTO[]
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
  product_id: string
  variant_rank?: number | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

export interface ProductCategoryDTO {
  id: string
  name: string
  description?: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category?: ProductCategoryDTO
  category_children: ProductCategoryDTO[]
  created_at: string | Date
  updated_at: string | Date
}

export interface ProductTagDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  products?: ProductDTO[]
}

export interface ProductCollectionDTO {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
  products?: ProductDTO[]
}

export interface ProductTypeDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

export interface ProductOptionDTO {
  id: string
  title: string
  product: ProductDTO
  values: ProductOptionValueDTO[]
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

export interface ProductImageDTO {
  id: string
  url: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

export interface ProductOptionValueDTO {
  id: string
  value: string
  option: ProductOptionDTO
  variant: ProductVariantDTO
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * Filters/Config (module API input filters and config)
 */
export interface FilterableProductProps
  extends BaseFilterable<FilterableProductProps> {
  handle?: string | string[]
  id?: string | string[]
  tags?: { value?: string[] }
  categories?: {
    id?: string | string[] | OperatorMap<string>
  }
  category_ids?: string | string[] | OperatorMap<string>
}

export interface FilterableProductTagProps
  extends BaseFilterable<FilterableProductTagProps> {
  id?: string | string[]
  value?: string
}

export interface FilterableProductCollectionProps
  extends BaseFilterable<FilterableProductCollectionProps> {
  id?: string | string[]
  title?: string
}

export interface FilterableProductVariantProps
  extends BaseFilterable<FilterableProductVariantProps> {
  id?: string | string[]
  sku?: string | string[]
  product_id?: string | string[]
  options?: { id?: string[] }
}

export interface FilterableProductCategoryProps
  extends BaseFilterable<FilterableProductCategoryProps> {
  id?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  include_descendants_tree?: boolean
}

/**
 * Write DTO (module API input)
 */

export interface CreateProductTypeDTO {
  id?: string
  value: string
}

export interface CreateProductTagDTO {
  id?: string
  value: string
}

export interface CreateProductOptionDTO {
  title: string
}

export interface CreateProductVariantOptionDTO {
  value: string
}

export interface CreateProductVariantDTO {
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
  options?: CreateProductVariantOptionDTO[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductVariantDTO {
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
  options?: CreateProductVariantOptionDTO[]
  metadata?: Record<string, unknown>
}

export interface CreateProductDTO {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[] | { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductTypeDTO
  type_id?: string
  collection_id?: string
  tags?: CreateProductTagDTO[]
  categories?: { id: string }[]
  options?: CreateProductOptionDTO[]
  variants?: CreateProductVariantDTO[]
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
}

export interface UpdateProductDTO {
  id: string
  title?: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[] | { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductTypeDTO
  type_id?: string | null
  collection_id?: string | null
  tags?: CreateProductTagDTO[]
  categories?: { id: string }[]
  options?: CreateProductOptionDTO[]
  variants?: (CreateProductVariantDTO | UpdateProductVariantDTO)[]
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
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
  status?: ProductStatus
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
  id: string,
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
  product: { id: string }
  title: string
}
