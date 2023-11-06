import { CreateMoneyAmountDTO, MoneyAmountDTO } from "./money-amount"

import { BaseFilterable } from "../../dal"
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
  rules: PriceListRuleDTO[]
  price_list_rules: PriceListRuleDTO[]
}

export interface PriceListPriceDTO extends CreateMoneyAmountDTO {
  price_set_id: string
}

export interface CreatePriceListRules extends Record<string, string[]> {}
export interface CreatePriceListDTO {
  title: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
  rules?: CreatePriceListRules
  prices?: PriceListPriceDTO[]
}

export interface UpdatePriceListDTO {
  id: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
  rules?: CreatePriceListRules
}

export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  id?: string[]
  starts_at?: Date[]
  ends_at?: Date[]
  status?: PriceListStatus[]
  number_rules?: number[]
}
export interface FilterablePriceListRuleProps
  extends BaseFilterable<FilterablePriceListRuleProps> {
  id?: string[]
  value?: string[]
  rule_type?: string[]
  price_list_id?: string[]
}

export interface FilterablePriceListRuleValueProps
  extends BaseFilterable<FilterablePriceListRuleValueProps> {
  id?: string[]
  value?: string[]
  price_list_rule_id?: string[]
}

export interface PriceListRuleDTO {
  id: string
  value: string
  priority: number
  rule_type: RuleTypeDTO
  price_list: PriceListDTO
}

export interface CreatePriceListRuleDTO {
  rule_type_id?: string
  rule_type?: string | RuleTypeDTO
  price_list_id?: string
  price_list?: string | PriceListDTO
}

export interface UpdatePriceListRuleDTO {
  id: string
  price_list_id?: string
  rule_type_id?: string
}

export interface PriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule: PriceListRuleDTO
}

export interface CreatePriceListRuleValueDTO {
  value: string
  price_list_rule_id?: string
  price_list_rule?: PriceListRuleDTO | string
}

export interface UpdatePriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule_id: string
}

export interface AddPriceListPricesDTO {
  priceListId: string
  prices: [
    {
      amount: number
      currency_code: string
      price_set_id: string
    }
  ]
}

export interface SetPriceListRulesDTO {
  priceListId: string
  rules: Record<string, string | string[]>
}

export interface RemovePriceListRulesDTO {
  priceListId: string
  rules: string[]
}
