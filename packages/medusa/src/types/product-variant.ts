import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { IsType } from "../utils/validators/is-type"
import {
  DateComparisonOperator,
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "./common"
import { XorConstraint } from "./validators/xor"

export type ProductVariantPrice = {
  id?: string
  currency_code?: string
  region_id?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export type GetRegionPriceContext = {
  regionId: string
  quantity?: number
  customer_id?: string
  include_discount_prices?: boolean
}

export type ProductVariantOption = {
  option_id: string
  value: string
}

export type CreateProductVariantInput = {
  title?: string
  product_id?: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  variant_rank?: number
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options: ProductVariantOption[]
  prices: ProductVariantPrice[]
  metadata?: Record<string, unknown>
}

export type UpdateProductVariantInput = {
  title?: string
  product_id?: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  variant_rank?: number
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: ProductVariantOption[]
  prices?: ProductVariantPrice[]
  metadata?: Record<string, unknown>
}

export class FilterableProductVariantProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @IsType([String, [String]])
  title?: string | string[]

  @IsType([String, [String]])
  product_id?: string | string[]

  @IsType([String, [String]])
  sku?: string | string[]

  @IsType([String, [String]])
  barcode?: string | string[]

  @IsType([String, [String]])
  ean?: string | string[]

  @IsType([String])
  upc?: string

  @IsType([Number, NumericalComparisonOperator])
  inventory_quantity?: number | NumericalComparisonOperator

  @IsBoolean()
  allow_backorder?: boolean

  @IsBoolean()
  manage_inventory?: boolean

  @IsType([String, [String]])
  hs_code?: string | string[]

  @IsType([String, [String]])
  origin_country?: string | string[]

  @IsType([String, [String]])
  mid_code?: string | string[]

  @IsString()
  material?: string

  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  @IsString()
  q?: string

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}

export class ProductVariantPricesUpdateReq {
  @IsString()
  @IsOptional()
  id?: string

  @ValidateIf((o) => !o.id)
  @Validate(XorConstraint, ["currency_code"])
  region_id?: string

  @ValidateIf((o) => !o.id)
  @Validate(XorConstraint, ["region_id"])
  currency_code?: string

  @IsInt()
  amount: number

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number
}

export class ProductVariantPricesCreateReq {
  @Validate(XorConstraint, ["currency_code"])
  region_id?: string

  @Validate(XorConstraint, ["region_id"])
  currency_code?: string

  @IsInt()
  amount: number

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number
}
