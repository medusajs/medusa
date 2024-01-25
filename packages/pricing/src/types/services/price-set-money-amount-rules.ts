import {
  BaseFilterable,
  PriceSetMoneyAmountDTO,
  RuleTypeDTO,
} from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"
import { IPriceSetMoneyAmountRulesRepository } from "../repositories"

export interface IPriceSetMoneyAmountRuleService<
  TEntity extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules
> extends AbstractService<
    TEntity,
    {
      priceSetMoneyAmountRulesRepository: IPriceSetMoneyAmountRulesRepository<TEntity>
    },
    {
      create: CreatePriceSetMoneyAmountRulesDTO
      update: UpdatePriceSetMoneyAmountRulesDTO
    },
    {
      list: FilterablePriceSetMoneyAmountRulesProps
      listAndCount: FilterablePriceSetMoneyAmountRulesProps
    }
  > {}

export interface CreatePriceSetMoneyAmountRulesDTO {
  price_set_money_amount: string
  rule_type: string
  value: string
}

export interface UpdatePriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount?: string
  rule_type?: string
  value?: string
}

export interface PriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount: PriceSetMoneyAmountDTO
  rule_type: RuleTypeDTO
  value: string
}

export interface FilterablePriceSetMoneyAmountRulesProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountRulesProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_money_amount_id?: string[]
  value?: string[]
}
