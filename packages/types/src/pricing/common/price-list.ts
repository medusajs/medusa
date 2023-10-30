import { BaseFilterable } from "../../dal"
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
  rules: PriceListRuleDTO[]
}

export interface CreatePriceListDTO {
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
  rules: PriceListRuleDTO[]
}

export interface UpdatePriceListDTO {
  id: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
  rules: PriceListRuleDTO[]
}

export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  id?: string[]
  starts_at?: Date[]
  ends_at?: Date[]
  status?: PriceListStatus[]
  number_rules?: number[]
}


export interface PriceListRuleDTO { 
  id: string
  value: string
  priority: number
  rule_type: RuleTypeDTO
  price_list: PriceListDTO
}

export interface CreatePriceListRuleDTO {
  id: string
  rule_type_id: string
  value: string
  price_list_id: string
}

export interface UpdatePriceListRuleDTO {
  id: string
  value: string
}