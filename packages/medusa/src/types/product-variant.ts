import { ValidateNested, IsString, IsNumber, IsBoolean } from "class-validator"
import {
  NumericalComparisonOperator,
  StringComparisonOperator,
  DateComparisonOperator,
} from "./common"
import { IsType } from "./validators"

export interface IProductVariantPrice {
  currency_code?: string
  region_id?: string
  amount: number
  sale_amount?: number | undefined
}

export interface IProductVariantOption {
  option_id: string
  value: string
}

export interface CreateProductVariantInput {
  title?: string
  product_id: string
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
  options: IProductVariantOption[]
  prices: IProductVariantPrice[]
  metadata?: JSON
}

export interface UpdateProductVariantInput {
  title?: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
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
  options: IProductVariantOption[]
  prices: IProductVariantPrice[]
  metadata?: JSON
}

export class FilterableProductVariantProps {
  @ValidateNested()
  @IsType(["string", "int"], { each: true })
  id?: string | Array<string> | StringComparisonOperator

  @IsString()
  title?: string

  @IsType(["string"], { each: true })
  product_id?: string | Array<string>

  @IsType(["string"], { each: true })
  sku?: string | Array<string>

  @IsType(["string"], { each: true })
  barcode?: string | Array<string>

  @IsType(["string"], { each: true })
  ean?: string

  @IsType(["string"], { each: true })
  upc?: string

  @IsNumber()
  inventory_quantity?: number

  @IsBoolean()
  allow_backorder?: boolean

  @IsBoolean()
  manage_inventory?: boolean

  @IsType(["string"], { each: true })
  hs_code?: string | Array<string>

  @IsType(["string"], { each: true })
  origin_country?: string | Array<string>

  @IsType(["string"], { each: true })
  mid_code?: string | Array<string>

  @IsString()
  material?: string

  @IsNumber()
  weight?: number | NumericalComparisonOperator

  @IsNumber()
  length?: number

  @IsNumber()
  height?: number

  @IsNumber()
  width?: number

  @IsString()
  q?: string

  @ValidateNested()
  created_at?: DateComparisonOperator

  @ValidateNested()
  updated_at?: DateComparisonOperator
}
