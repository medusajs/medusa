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
import { DateComparisonOperator } from "./common"
import { XorConstraint } from "./validators/xor"

/**
 * @enum
 *
 * The type of price list.
 */
export enum PriceListType {
  /**
   * The price list is used for a sale.
   */
  SALE = "sale",
  /**
   * The price list is used to override original prices for specific conditions.
   */
  OVERRIDE = "override",
}

/**
 * @enum
 *
 * The status of a price list.
 */
export enum PriceListStatus {
  /**
   * The price list is active, meaning its prices are applied to customers.
   */
  ACTIVE = "active",
  /**
   * The price list is a draft, meaning its not yet applied to customers.
   */
  DRAFT = "draft",
}

/**
 * Filters to apply on the retrieved price lists.
 */
export class FilterablePriceListProps {
  /**
   * IDs to filter price lists by.
   */
  @IsString()
  @IsOptional()
  id?: string

  /**
   * Search terms to search price lists' description, name, and customer group's name.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Statuses to filter price lists by.
   */
  @IsOptional()
  @IsEnum(PriceListStatus, { each: true })
  status?: PriceListStatus[]

  /**
   * Name to filter price lists by.
   */
  @IsString()
  @IsOptional()
  name?: string

  /**
   * Filter price lists by their associated customer groups.
   */
  @IsOptional()
  @IsString({ each: true })
  customer_groups?: string[]

  /**
   * Description to filter price lists by.
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * Types to filter price lists by.
   */
  @IsOptional()
  @IsEnum(PriceListType, { each: true })
  type?: PriceListType[]

  /**
   * Date filters to apply on the price lists' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the price lists' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the price lists' `deleted_at` date.
   */
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
  variant_id: string
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
