import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator, StringComparisonOperator } from "./common"

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export class FilterableProductProps {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsEnum(ProductStatus, { each: true })
  status?: ProductStatus[]

  @IsArray()
  @IsOptional()
  price_list_id?: string[]

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  is_giftcard?: boolean

  @IsString()
  @IsOptional()
  type?: string

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

export class FilterableProductTagProps {
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsOptional()
  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string
}

export class FilterableProductTypeProps {
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsOptional()
  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string
}
