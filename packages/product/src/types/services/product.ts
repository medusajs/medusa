import { ProductStatus, ProductCategoryDTO } from "@medusajs/types"

export interface UpdateProductDTO {
  id: string
  title?: string
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
