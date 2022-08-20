import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator"
import { IsType } from "@medusajs/medusa/dist/utils/validators/is-type"
import { Type } from "class-transformer"
import {
  DateComparisonOperator,
  FindConfig,
} from "@medusajs/medusa/dist/types/common"
import { ProductReview } from "../models/product-review"

/**
 * API Level DTOs + Validation rules
 */
export class FilterableProductReviewProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  q?: string

  @IsArray()
  @IsOptional()
  product_id?: string[]

  @IsString()
  @IsOptional()
  email?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}

export type FindProductReviewConfig = FindConfig<ProductReview>

/**
 * Service Level DTOs
 */

export type CreateProductReviewInput = {
  product_id: string
  rating: number
  body?: string
  email: string
  name?: string
}
