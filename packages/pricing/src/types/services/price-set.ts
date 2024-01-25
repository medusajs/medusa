import {
  BaseFilterable,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
  RuleTypeDTO,
} from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"
import { PriceSet } from "@models"
import { IPriceSetRepository } from "../repositories"

export interface IPriceSetService<TEntity extends PriceSet = PriceSet>
  extends AbstractService<
    TEntity,
    { priceSetRepository: IPriceSetRepository<TEntity> },
    {
      create: Omit<CreatePriceSetDTO, "rules">
      update: Omit<UpdatePriceSetDTO, "rules">
    },
    {
      list: FilterablePriceSetProps
      listAndCount: FilterablePriceSetProps
    }
  > {}

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
