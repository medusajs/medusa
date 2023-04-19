import { Transform, Type } from "class-transformer"
import { extendedFindParamsMixin } from "./common"
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateIf,
  IsNumber,
  IsArray,
  Min,
} from "class-validator"
import { isDefined } from "medusa-core-utils"
import { ProductCategory } from "../models"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"

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
  @Transform(({ value }) => {
    if (value === "null") {
      return null
    } else {
      return value
    }
  })
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

export class GetProductCategoriesParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  parent_category_id?: string | null

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  depth?: number[]

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  include_descendants_tree?: boolean

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  descendants_depth?: number
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
