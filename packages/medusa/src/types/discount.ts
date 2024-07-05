import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from "class-validator"
import {
  AllocationType,
  DiscountConditionOperator,
  DiscountConditionType,
  DiscountRuleType,
  Region,
} from "../models"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator } from "./common"
import { ExactlyOne } from "./validators/exactly-one"

export type QuerySelector = {
  q?: string
}

/**
 * Filters to apply on discounts' rules.
 */
export class AdminGetDiscountsDiscountRuleParams {
  /**
   * Type to filter discount rules by.
   */
  @IsOptional()
  @IsEnum(DiscountRuleType)
  type?: DiscountRuleType

  /**
   * Allocation to filter discount rules by.
   */
  @IsOptional()
  @IsEnum(AllocationType)
  allocation?: AllocationType
}

export class FilterableDiscountProps {
  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_disabled?: boolean

  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

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
 * Fields to create or update a discount condition.
 */
export class AdminUpsertConditionsReq {
  /**
   * The products associated with the discount condition, if the discount condition's type is `products`.
   */
  @Validate(ExactlyOne, [
    "product_collections",
    "product_types",
    "product_tags",
    "customer_groups",
  ])
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  products?: string[]

  /**
   * The product collections associated with the discount condition, if the discount condition's type is `product_collections`.
   */
  @Validate(ExactlyOne, [
    "products",
    "product_types",
    "product_tags",
    "customer_groups",
  ])
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  product_collections?: string[]

  /**
   * The product types associated with the discount condition, if the discount condition's type is `product_types`.
   */
  @Validate(ExactlyOne, [
    "product_collections",
    "products",
    "product_tags",
    "customer_groups",
  ])
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  product_types?: string[]

  /**
   * The product tags associated with the discount condition, if the discount condition's type is `product_tags`.
   */
  @Validate(ExactlyOne, [
    "product_collections",
    "product_types",
    "products",
    "customer_groups",
  ])
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  product_tags?: string[]

  /**
   * The customer groups associated with the discount condition, if the discount condition's type is `customer_groups`.
   */
  @Validate(ExactlyOne, [
    "product_collections",
    "product_types",
    "products",
    "product_tags",
  ])
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  customer_groups?: string[]
}

export const DiscountConditionMapTypeToProperty = {
  [DiscountConditionType.PRODUCTS]: "products",
  [DiscountConditionType.PRODUCT_TYPES]: "product_types",
  [DiscountConditionType.PRODUCT_COLLECTIONS]: "product_collections",
  [DiscountConditionType.PRODUCT_TAGS]: "product_tags",
  [DiscountConditionType.CUSTOMER_GROUPS]: "customer_groups",
}

export type DiscountConditionInput = {
  rule_id?: string
  id?: string
  operator?: DiscountConditionOperator
  products?: (string | { id: string })[]
  product_collections?: (string | { id: string })[]
  product_types?: (string | { id: string })[]
  product_tags?: (string | { id: string })[]
  customer_groups?: (string | { id: string })[]
}

export type CreateDiscountRuleInput = {
  description?: string
  type: DiscountRuleType
  value: number
  allocation: AllocationType
  conditions?: DiscountConditionInput[]
}

export type CreateDiscountInput = {
  code: string
  rule: CreateDiscountRuleInput
  is_dynamic: boolean
  is_disabled: boolean
  starts_at?: Date
  ends_at?: Date
  valid_duration?: string
  usage_limit?: number
  regions?: string[] | Region[]
  metadata?: Record<string, unknown>
}

export type UpdateDiscountRuleInput = {
  id: string
  description?: string
  value?: number
  allocation?: AllocationType
  conditions?: DiscountConditionInput[]
}

export type UpdateDiscountInput = {
  code?: string
  rule?: UpdateDiscountRuleInput
  is_disabled?: boolean
  starts_at?: Date
  ends_at?: Date | null
  valid_duration?: string | null
  usage_limit?: number | null
  regions?: string[]
  metadata?: Record<string, unknown>
}

export type CreateDynamicDiscountInput = {
  code: string
  ends_at?: Date
  usage_limit: number
  metadata?: Record<string, unknown>
}
