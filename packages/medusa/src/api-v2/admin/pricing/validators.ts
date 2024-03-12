import { IsOptional, IsString } from "class-validator"
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
