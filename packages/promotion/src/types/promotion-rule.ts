import { PromotionRuleOperatorValues, PromotionTypes } from "@medusajs/types"
import { PromotionRule } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IPromotionRuleRepository } from "./repositories"

export interface IPromotionRuleService<
  TEntity extends PromotionRule = PromotionRule
> extends AbstractService<
    TEntity,
    { promotionRuleRepository: IPromotionRuleRepository<TEntity> },
    {
      create: CreatePromotionRuleDTO
      update: UpdatePromotionRuleDTO
    },
    {
      list: PromotionTypes.FilterablePromotionRuleProps
      listAndCount: PromotionTypes.FilterablePromotionRuleProps
    }
  > {}

export interface CreatePromotionRuleDTO {
  description?: string | null
  attribute: string
  operator: PromotionRuleOperatorValues
}

export interface UpdatePromotionRuleDTO {
  id: string
}
