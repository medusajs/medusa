import {
  BaseFilterable,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
  RuleTypeDTO,
} from "@medusajs/types"

export interface CreatePriceSetDTO {}

export interface UpdatePriceSetDTO {
  id: string
}

export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
}

export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}
