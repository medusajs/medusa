import { ProductStatus } from "../../product"

import {
  CreateProductOptionInputDTO,
  CreateProductProductCategoryInputDTO,
  CreateProductSalesChannelInputDTO,
  CreateProductTagInputDTO,
  CreateProductTypeInputDTO,
  CreateProductVariantInputDTO,
} from "./create-products"

export interface UpdateProductInputDTO {
  /**
   * TODO: check this fields
   */

  id: string
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

export interface UpdateProductsWorkflowInputDTO {
  products: UpdateProductInputDTO[]
}
