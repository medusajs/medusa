import { MoneyAmountDTO } from "./money-amount"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export interface PriceListDTO {
  id: string
  starts_at: Date | null
  status: PriceListStatus
  ends_at: Date | null
  number_rules?: number
  price_set_money_amounts: PriceSetMoneyAmountDTO
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
  price_list_rules: PriceListRuleDTO[]
}


export interface PriceListRuleDTO { 
  id: string
  value: string
  priority: number
  rule_type: RuleTypeDTO
  price_list: PriceListDTO
}