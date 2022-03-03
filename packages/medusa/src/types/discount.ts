import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { AdminGetDiscountsDiscountRuleParams } from ".."
import { DiscountConditionType } from "../models/discount-condition"

export type QuerySelector = {
  q?: string
}

export class FilterableDiscountProps {
  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_disabled?: boolean

  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams
}

type CreateDiscountRuleInput = {
  description?: string
  type: string
  value: number
  allocation: string
  conditions?: { resource: DiscountConditionType; resource_ids: string[] }[]
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
  regions?: string[]
  metadata?: Record<string, unknown>
}

export type UpdateDiscountRuleInput = {
  id: string
  description?: string
  type: string
  value: string
  allocation: string
}

export type UpdateDiscountInput = {
  code?: string
  rule?: UpdateDiscountRuleInput
  is_dynamic?: boolean
  is_disabled?: boolean
  starts_at?: Date
  ends_at?: Date
  valid_duration?: string
  usage_limit?: number
  regions?: string[]
  metadata?: Record<string, unknown>
}

export type CreateDynamicDiscountInput = {
  code: string
  ends_at?: Date
  usage_limit: number
  metadata?: object
}

export class AdminPostDiscountsDiscountRuleConditionReq {
  @IsString()
  resource: DiscountConditionType

  @IsArray()
  @IsString({ each: true })
  resource_ids: string[]
}
