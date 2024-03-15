import { RuleOperator } from "@medusajs/utils"
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

export class AdminPostFulfillmentShippingOptionsRulesBatchAddReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillmentRuleCreate)
  rules: FulfillmentRuleCreate[]
}

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
