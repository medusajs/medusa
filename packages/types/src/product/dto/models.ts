import { ProductBaseDTO, ProductVariantBaseDTO } from "./base"
import { ProductStatus } from "../common"

/********************************************************************************/
/*                              Model DTO's                                     */
/********************************************************************************/
export interface ProductDTO extends ProductBaseDTO<ProductVariantDTO> {
  title: string
  handle?: string
  subtitle?: string
  description?: string
  is_giftcard: boolean
  status: ProductStatus
  thumbnail?: string
  options?: ProductOptionDTO[]
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  origin_country?: string | null
  hs_code?: string | null
  mid_code?: string | null
  material?: string | null
  collection_id?: string | null
  collection?: ProductCollectionDTO
  type_id?: string | null
  type?: ProductTypeDTO
  tags?: ProductTagDTO[]
  images?: ProductImageDTO[]
  categories?: ProductCategoryDTO[]
  discountable?: boolean
  external_id?: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  metadata?: Record<string, any> | null
}

export interface ProductVariantDTO extends ProductVariantBaseDTO {
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
  metadata?: Record<string, unknown> | null
  variant_rank?: number | null
  product_id: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  product: ProductDTO
  options?: ProductOptionValueDTO[]
}

export interface ProductCategoryDTO {
  id: string
  name?: string
  description?: string
  handle?: string
  mpath?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id?: string | null
  parent_category?: ProductCategoryDTO
  category_children?: ProductCategoryDTO[]
  created_at?: Date
  updated_at?: Date
  products?: ProductDTO[]
}

export interface ProductCollectionDTO {
  id: string
  title: string
  handle?: string
  metadata?: Record<string, unknown> | null
  created_at?: Date
  updated_at?: Date
  products?: ProductDTO[]
}

export interface ProductImageDTO {
  id: string
  url: string
  metadata?: Record<string, unknown> | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

export interface ProductOptionDTO {
  id: string
  title: string
  product_id?: string | null
  product?: ProductDTO
  values?: ProductOptionValueDTO[]
  metadata?: Record<string, unknown> | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

export interface ProductOptionValueDTO {
  id: string
  value: string
  option_id: string | null
  option?: ProductOptionDTO
  variant_id: string | null
  variants?: ProductVariantDTO[]
  metadata?: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface ProductTagDTO {
  id: string
  value: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  products?: ProductDTO[]
}

export interface ProductTypeDTO {
  id: string
  value: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  metadata?: Record<string, unknown> | null
}

/********************************************************************************/
/*                              Model DTO's                                     */
/********************************************************************************/
