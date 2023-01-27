import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator"

export type CreateProductCategoryInput = {
  name: string
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
}

export type UpdateProductCategoryInput = {
  name?: string
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
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
