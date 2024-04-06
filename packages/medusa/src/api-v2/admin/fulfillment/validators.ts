import {
  RuleOperator,
  ShippingOptionPriceType as ShippingOptionPriceTypeEnum,
} from "@medusajs/utils"
import { Type } from "class-transformer"
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator"
import { IsType } from "../../../utils"
import { FindParams } from "../../../types/common"
import { z } from "zod"

/**
 * SHIPPING OPTIONS RULES
 */

// eslint-disable-next-line max-len
export class AdminPostFulfillmentShippingOptionsRulesBatchAddParams extends FindParams {}

export class AdminPostFulfillmentShippingOptionsRulesBatchAddReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillmentRuleCreate)
  rules: FulfillmentRuleCreate[]
}

// eslint-disable-next-line max-len
export class AdminPostFulfillmentShippingOptionsRulesBatchRemoveParams extends FindParams {}

export class AdminPostFulfillmentShippingOptionsRulesBatchRemoveReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  rule_ids: string[]
}

export class FulfillmentRuleCreate {
  @IsEnum(RuleOperator)
  operator: RuleOperator

  @IsNotEmpty()
  @IsString()
  attribute: string

  @IsType([String, [String]])
  value: string | string[]
}

export const AdminPostShippingOptionsFulfillmentRuleCreate = z
  .object({
    operator: z.nativeEnum(RuleOperator),
    attribute: z.string(),
    value: z.string().or(z.array(z.string())),
  })
  .strict()

/**
 * SHIPPING OPTIONS
 */

export const AdminPostFulfillmentShippingOptionsShippingOptionType = z
  .object({
    label: z.string(),
    description: z.string(),
    code: z.string(),
  })
  .strict()

export class AdminPostShippingOptionsShippingOptionParams extends FindParams {}

// eslint-disable-next-line max-len
export const AdminPostFulfillmentShippingOptionsShippingOptionCurrencyCodePrice =
  z
    .object({
      currency_code: z.string(),
      amount: z.number(),
    })
    .strict()

export const AdminPostFulfillmentShippingOptionsShippingOptionRegionPrice = z
  .object({
    region_id: z.string(),
    amount: z.number(),
  })
  .strict()

export const AdminPostFulfillmentShippingOptionsShippingOption = z
  .object({
    name: z.string(),
    service_zone_id: z.string(),
    shipping_profile_id: z.string(),
    data: z.record(z.unknown()).optional(),
    price_type: z.nativeEnum(ShippingOptionPriceTypeEnum),
    provider_id: z.string(),
    type: AdminPostFulfillmentShippingOptionsShippingOptionType,
    prices:
      AdminPostFulfillmentShippingOptionsShippingOptionCurrencyCodePrice.or(
        AdminPostFulfillmentShippingOptionsShippingOptionRegionPrice
      ).array(),
    rules: z.array(AdminPostShippingOptionsFulfillmentRuleCreate).optional(),
  })
  .strict()
