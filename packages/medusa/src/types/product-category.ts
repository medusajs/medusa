import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator"
import { ProductCategory } from "../models"

type ProductCategoryInput = {
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
  parent_category?: ProductCategory | null
  position?: number
}

export type CreateProductCategoryInput = ProductCategoryInput & {
  name: string
}

export type UpdateProductCategoryInput = ProductCategoryInput & {
  name?: string
}

export class AdminProductCategoriesReqBase {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
  targetParentId: string | null
  originalPosition: number
  targetPosition: number | undefined
  shouldChangeParent: boolean
  shouldChangePosition: boolean
  shouldIncrementPosition: boolean
  shouldDeleteElement: boolean
}
