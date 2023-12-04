import { PriceSetDTO, RuleTypeDTO } from "../services"

export interface CreatePriceSetRuleTypeDTO {
  price_set: PriceSetDTO | string
  rule_type: RuleTypeDTO | string
}

export interface UpdatePriceSetRuleTypeDTO {
  id: string
  price_set?: string
  rule_type?: string
}
