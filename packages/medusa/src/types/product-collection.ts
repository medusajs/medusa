import { IsOptional, IsString, ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { Type } from "class-transformer"
import { DateComparisonOperator } from "./common"

/**
 * API Level DTOs + Validation rules
 */
export class FilterableProductCollectionProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

/**
 * Service Level DTOs
 */

export type ProductCollectionInput = {
  title: string
  images?: string[]
  thumbnail?: string
  handle?: string
  metadata?: Record<string, unknown>
}
