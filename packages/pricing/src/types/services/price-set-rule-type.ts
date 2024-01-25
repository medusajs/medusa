import { BaseFilterable, PriceSetDTO, RuleTypeDTO } from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"
import { PriceSetRuleType } from "@models"
import { IPriceSetRuleTypeRepository } from "../repositories"

export interface IPriceSetRuleTypeService<
  TEntity extends PriceSetRuleType = PriceSetRuleType
> extends AbstractService<
    TEntity,
    { priceSetRuleTypeRepository: IPriceSetRuleTypeRepository<TEntity> },
    {
      create: CreatePriceSetRuleTypeDTO
      update: UpdatePriceSetRuleTypeDTO
    },
    {
      list: FilterablePriceSetRuleTypeProps
      listAndCount: FilterablePriceSetRuleTypeProps
    }
  > {}

export interface CreatePriceSetRuleTypeDTO {
  price_set: PriceSetDTO | string
  rule_type: RuleTypeDTO | string
}

export interface UpdatePriceSetRuleTypeDTO {
  id: string
  price_set?: string
  rule_type?: string
}

export interface PriceSetRuleTypeDTO {
  id: string
  price_set: PriceSetDTO
  rule_type: RuleTypeDTO
  value: string
}

export interface FilterablePriceSetRuleTypeProps
  extends BaseFilterable<FilterablePriceSetRuleTypeProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_id?: string[]
}
