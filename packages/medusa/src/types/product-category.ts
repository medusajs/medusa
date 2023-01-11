import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator"

export type CreateProductCategory = {
  name: string
  handle: string
  is_internal?: boolean
  is_active?: boolean
}

export type UpdateProductCategory = {
  name?: string
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
}

export class AdminProductCategoriesReqBase {
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
