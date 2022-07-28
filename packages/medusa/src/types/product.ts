import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Product, ProductOptionValue, ProductStatus } from "../models"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"
import { IsType } from "../utils/validators/is-type"
import {
  DateComparisonOperator,
  FindConfig,
  StringComparisonOperator,
} from "./common"
import { PriceListLoadConfig } from "./price-list"

/**
 * API Level DTOs + Validation rules
 */
export class FilterableProductProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

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

  @IsArray()
  @IsOptional()
  sales_channel_id?: string[]

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

/**
 * Service Level DTOs
 */

export type CreateProductInput = {
  title: string
  subtitle?: string
  profile_id?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductProductTypeInput
  collection_id?: string
  tags?: CreateProductProductTagInput[]
  options?: CreateProductProductOption[]
  variants?: CreateProductProductVariantInput[]
  sales_channels?: CreateProductProductSalesChannelInput[] | null
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
}

export type CreateProductProductTagInput = {
  id?: string
  value: string
}

export type CreateProductProductSalesChannelInput = {
  id: string
}

export type CreateProductProductTypeInput = {
  id?: string
  value: string
}

export type CreateProductProductVariantInput = {
  title: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: object
  prices?: CreateProductProductVariantPriceInput[]
  options?: { value: string }[]
}

export type UpdateProductProductVariantDTO = {
  id?: string
  title?: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: object
  prices?: CreateProductProductVariantPriceInput[]
  options?: { value: string; option_id: string }[]
}

export type CreateProductProductOption = {
  title: string
}

export type CreateProductProductVariantPriceInput = {
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export type UpdateProductInput = Omit<
  Partial<CreateProductInput>,
  "variants"
> & {
  variants?: UpdateProductProductVariantDTO[]
}

export type ProductOptionInput = {
  title: string
  values?: ProductOptionValue[]
}

export type FindProductConfig = FindConfig<Product> & PriceListLoadConfig

export class ProductSalesChannelReq {
  @IsString()
  id: string
}

export class ProductTagReq {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  value: string
}

export class ProductTypeReq {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  value: string
}
