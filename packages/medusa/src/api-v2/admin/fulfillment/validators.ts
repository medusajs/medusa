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
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { IsType } from "../../../utils"
import { ShippingOptionPriceType } from "@medusajs/types"
import { FindParams } from "../../../types/common"

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

/**
 * SHIPPING OPTIONS
 */

export class AdminPostShippingOptionsShippingOptionParams extends FindParams {}

export class AdminPostFulfillmentShippingOptionsShippingOptionType {
  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  code: string
}

// eslint-disable-next-line max-len
export class AdminPostFulfillmentShippingOptionsShippingOptionCurrencyCodePrice {
  @IsString()
  @IsNotEmpty()
  currency_code: string

  @IsNotEmpty()
  amount: number
}

export class AdminPostFulfillmentShippingOptionsShippingOptionRegionPrice {
  @IsString()
  @IsNotEmpty()
  region_id: string

  @IsNotEmpty()
  amount: number
}

export class AdminPostFulfillmentShippingOptionsShippingOption {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  service_zone_id: string

  @IsString()
  @IsNotEmpty()
  shipping_profile_id: string

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>

  @IsEnum(ShippingOptionPriceTypeEnum)
  price_type: ShippingOptionPriceType

  @IsString()
  @IsNotEmpty()
  provider_id: string

  @IsType([AdminPostFulfillmentShippingOptionsShippingOptionType])
  type: AdminPostFulfillmentShippingOptionsShippingOptionType

  @IsArray()
  @ValidateNested({ each: true })
  @IsType([
    AdminPostFulfillmentShippingOptionsShippingOptionCurrencyCodePrice,
    AdminPostFulfillmentShippingOptionsShippingOptionRegionPrice,
  ])
  prices: (
    | AdminPostFulfillmentShippingOptionsShippingOptionCurrencyCodePrice
    | AdminPostFulfillmentShippingOptionsShippingOptionRegionPrice
  )[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillmentRuleCreate)
  rules?: FulfillmentRuleCreate[]
}
