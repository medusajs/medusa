import { ProductBaseDTO } from "../base"
import { ProductDTO, ProductOptionDTO, ProductVariantDTO } from "../models"
import { DeepPartial } from "../../../common"

export interface CreateProductTypeDTO {
  id?: string
  value: string
  metadata?: Record<string, unknown>
}

export interface UpdateProductTypeDTO {
  id: string
  value?: string
  metadata?: Record<string, unknown>
}

export interface CreateProductOptionDTO extends DeepPartial<ProductOptionDTO> {}

export interface UpdateProductOptionDTO extends DeepPartial<ProductOptionDTO> {
  id: string
}

export interface CreateProductCollectionDTO<
  TExtendedProductBaseDTO extends ProductBaseDTO | undefined = undefined
> {
  title: string
  handle?: string
  products?: (TExtendedProductBaseDTO extends undefined
    ? ProductBaseDTO
    : TExtendedProductBaseDTO)[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductCollectionDTO<
  TExtendedProductBaseDTO extends ProductBaseDTO | undefined = undefined
> {
  id: string
  value?: string
  title?: string
  handle?: string
  products?: (TExtendedProductBaseDTO extends undefined
    ? ProductBaseDTO
    : TExtendedProductBaseDTO)[]
  metadata?: Record<string, unknown>
}

export interface CreateProductCategoryDTO {
  name: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id: string | null
  metadata?: Record<string, unknown>
}

export interface UpdateProductCategoryDTO {
  name?: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id?: string | null
  metadata?: Record<string, unknown>
}

export interface CreateProductDTO extends DeepPartial<ProductDTO> {}

export interface UpdateProductDTO extends DeepPartial<ProductDTO> {
  id: string
}

export interface CreateProductVariantDTO
  extends DeepPartial<ProductVariantDTO> {}

export interface UpdateProductVariantDTO
  extends DeepPartial<ProductVariantDTO> {
  id: string
}

export interface CreateProductTagDTO {
  value: string
}

export interface UpsertProductTagDTO {
  id?: string
  value: string
}

export interface UpdateProductTagDTO {
  id: string
  value?: string
}
