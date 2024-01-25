import { PromotionRuleDTO, PromotionTypes } from "@medusajs/types"
import { PromotionRule, PromotionRuleValue } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IPromotionRuleValueRepository } from "./repositories"

export interface IPromotionRuleValueService<
  TEntity extends PromotionRuleValue = PromotionRuleValue
> extends AbstractService<
    TEntity,
    { promotionRuleValueRepository: IPromotionRuleValueRepository<TEntity> },
    {
      create: CreatePromotionRuleValueDTO
      update: UpdatePromotionRuleValueDTO
    },
    {
      list: PromotionTypes.FilterablePromotionRuleValueProps
      listAndCount: PromotionTypes.FilterablePromotionRuleValueProps
    }
  > {}

export interface CreatePromotionRuleValueDTO {
  value: any
  promotion_rule: string | PromotionRuleDTO | PromotionRule
}

export interface UpdatePromotionRuleValueDTO {
  id: string
  value: any
  promotion_rule: string | PromotionRuleDTO | PromotionRule
}
