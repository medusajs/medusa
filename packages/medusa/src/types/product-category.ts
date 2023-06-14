import { Transform } from "class-transformer"
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateIf,
} from "class-validator"
import { isDefined } from "medusa-core-utils"
import { ProductCategory } from "../models"

export const tempReorderRank = 99999
type ProductCategoryInput = {
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
  parent_category?: ProductCategory | null
  rank?: number
}

export type CreateProductCategoryInput = ProductCategoryInput & {
  name: string
}

export type UpdateProductCategoryInput = ProductCategoryInput & {
  name?: string
}

export class AdminProductCategoriesReqBase {
  @Transform(({ value }) => (value === "null" ? null : value))
  @ValidateIf((input) => isDefined(input.description))
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  handle?: string

  @IsBoolean()
  @IsOptional()
  is_internal?: boolean

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  parent_category_id?: string | null
}

export class ProductBatchProductCategory {
  @IsString()
  id: string
}

export type ReorderConditions = {
  targetCategoryId: string
  originalParentId: string | null
  targetParentId: string | null | undefined
  originalRank: number
  targetRank: number | undefined
  shouldChangeParent: boolean
  shouldChangeRank: boolean
  shouldIncrementRank: boolean
  shouldDeleteElement: boolean
}
