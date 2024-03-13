import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class AdminGetPricingRuleTypesRuleTypeParams extends FindParams {}
export class AdminGetPricingRuleTypesParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  rule_attribute?: string[]
}

export class AdminPostPricingRuleTypesReq {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  rule_attribute: string

  @IsNotEmpty()
  @IsNumber()
  default_priority: number
}

export class AdminPostPricingRuleTypesRuleTypeReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  rule_attribute?: string

  @IsOptional()
  @IsNumber()
  default_priority?: number
}

export class AdminDeletePricingRuleTypesRuleTypeReq {}
