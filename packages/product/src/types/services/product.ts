import { ProductUtils } from "@medusajs/utils"

export type ProductEventData = {
  id: string
}

export enum ProductEvents {
  PRODUCT_UPDATED = "product.updated",
  PRODUCT_CREATED = "product.created",
  PRODUCT_DELETED = "product.deleted",
}

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
  status?: ProductUtils.ProductStatus
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
