import { DAL, PromotionTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PromotionRule } from "@models"
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "../types"

type InjectedDependencies = {
  promotionRuleRepository: DAL.RepositoryService
}

export default class PromotionRuleService<
  TEntity extends PromotionRule = PromotionRule
> extends ModulesSdkUtils.abstractServiceFactory<
  PromotionRule,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.PromotionRuleDTO
    list: PromotionTypes.PromotionRuleDTO
    listAndCount: PromotionTypes.PromotionRuleDTO
    create: CreatePromotionRuleDTO
    update: UpdatePromotionRuleDTO
  },
  {
    list: PromotionTypes.FilterablePromotionRuleProps
    listAndCount: PromotionTypes.FilterablePromotionRuleProps
  }
>(PromotionRule) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
