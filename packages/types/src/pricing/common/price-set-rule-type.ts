import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"
import { RuleTypeDTO } from "./rule-type"

export interface PriceSetRuleTypeDTO {
  id: string
  price_set: PriceSetDTO
  rule_type: RuleTypeDTO
  value: string
}

export interface CreatePriceSetRuleTypeDTO {
  price_set_id: string
  rule_type_id: string
}

export interface UpdatePriceSetRuleTypeDTO {
  id: string
  price_set?: string
  rule_type?: string
}

export interface FilterablePriceSetRuleTypeProps
  extends BaseFilterable<FilterablePriceSetRuleTypeProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_id?: string[]
}
