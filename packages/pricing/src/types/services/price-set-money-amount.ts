import {
  BaseFilterable,
  MoneyAmountDTO,
  PriceListDTO,
  PriceRuleDTO,
  PriceSetDTO,
} from "@medusajs/types"

export interface UpdatePriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  money_amount?: MoneyAmountDTO
  rules_count?: number
}

export interface CreatePriceSetMoneyAmountDTO {
  title?: string
  price_set?: PriceSetDTO | string
  price_list?: PriceListDTO | string
  money_amount?: MoneyAmountDTO | string
  rules_count?: number
}

export interface FilterablePriceSetMoneyAmountProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountProps> {
  id?: string[]
  price_set_id?: string[]
  price_list_id?: string[]
}

export interface PriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  price_list?: PriceListDTO
  price_set_id?: string
  price_rules?: PriceRuleDTO[]
  money_amount?: MoneyAmountDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
