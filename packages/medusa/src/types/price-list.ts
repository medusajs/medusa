import { Type } from "class-transformer"
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { PriceList } from "../models/price-list"
import { DateComparisonOperator, FindConfig } from "./common"
import { XorConstraint } from "./validators/xor"

export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}

export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export class FilterablePriceListProps {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsEnum(PriceListStatus, { each: true })
  status?: PriceListStatus[]

  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsString({ each: true })
  customer_groups?: string[]

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @IsEnum(PriceListType, { each: true })
  type?: PriceListType[]

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

export class AdminPriceListPricesUpdateReq {
  @IsString()
  @IsOptional()
  id?: string

  @ValidateIf((o) => !o.id)
  @Validate(XorConstraint, ["currency_code"])
  region_id?: string

  @ValidateIf((o) => !o.id)
  @Validate(XorConstraint, ["region_id"])
  currency_code?: string

  @IsString()
  variant_id: string

  @IsInt()
  amount: number

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number
}

export class AdminPriceListPricesCreateReq {
  @Validate(XorConstraint, ["currency_code"])
  region_id?: string

  @Validate(XorConstraint, ["region_id"])
  currency_code?: string

  @IsInt()
  amount: number

  @IsString()
  variant_id: string

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number
}

export type CreatePriceListInput = {
  name: string
  description: string
  type: PriceListType
  status?: PriceListStatus
  prices: AdminPriceListPricesCreateReq[]
  customer_groups?: { id: string }[]
  starts_at?: Date
  ends_at?: Date
  includes_tax?: boolean
}

export type UpdatePriceListInput = Partial<
  Pick<
    PriceList,
    | "name"
    | "description"
    | "starts_at"
    | "ends_at"
    | "status"
    | "type"
    | "includes_tax"
  >
> & {
  prices?: AdminPriceListPricesUpdateReq[]
  customer_groups?: { id: string }[]
}

export type PriceListPriceUpdateInput = {
  id?: string
  variant_id?: string
  region_id?: string
  currency_code?: string
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

export type PriceListPriceCreateInput = {
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export type PriceListLoadConfig = {
  include_discount_prices?: boolean
  customer_id?: string
  cart_id?: string
  region_id?: string
  currency_code?: string
}
