import { PriceSet, RuleType } from "@models"

export interface CreatePriceSetRuleTypeDTO {
  price_set: PriceSet | string
  rule_type: RuleType | string
}

export interface UpdatePriceSetRuleTypeDTO {
  id: string
  price_set?: string
  rule_type?: string
}
