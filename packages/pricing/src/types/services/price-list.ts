import { PriceListStatus, PriceListType } from "@medusajs/utils"
import {
  BaseFilterable,
  MoneyAmountDTO,
  PriceListRuleDTO,
  PriceSetMoneyAmountDTO,
  RuleTypeDTO,
} from "@medusajs/types"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: Date | string | null
  ends_at?: Date | string | null
  status?: PriceListStatus
  type?: PriceListType
  number_rules?: number
}

export interface UpdatePriceListDTO {
  id: string
  title?: string
  starts_at?: Date | string | null
  ends_at?: Date | string | null
  status?: PriceListStatus
  number_rules?: number
}

export interface PriceListDTO {
  id: string
  title?: string
  starts_at?: string | null
  status?: PriceListStatus
  ends_at?: string | null
  number_rules?: number
  price_set_money_amounts?: PriceSetMoneyAmountDTO[]
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
  rules?: PriceListRuleDTO[]
  price_list_rules?: PriceListRuleDTO[]
}

export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  id?: string[]
  starts_at?: string[]
  ends_at?: string[]
  status?: PriceListStatus[]
  number_rules?: number[]
}
