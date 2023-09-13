import { ProductStatus } from "../../product"

import {
  CreateProductProductCategoryInputDTO,
  CreateProductSalesChannelInputDTO,
  CreateProductTagInputDTO,
  CreateProductTypeInputDTO,
  CreateProductVariantInputDTO,
} from "./create-products"

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
  type?: CreateProductTypeInputDTO
  collection_id?: string
  tags?: CreateProductTagInputDTO[]
  sales_channels?: CreateProductSalesChannelInputDTO[]
  categories?: CreateProductProductCategoryInputDTO[]
  variants?: CreateProductVariantInputDTO[]
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
  config: { listConfig?: { relations?: string[]; select?: string[] } }
}
