import { DAL, PromotionTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PromotionRuleValue } from "@models"
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "../types"

type InjectedDependencies = {
  promotionRuleValueRepository: DAL.RepositoryService
}

export default class PromotionRuleValueService<
  TEntity extends PromotionRuleValue = PromotionRuleValue
> extends ModulesSdkUtils.abstractServiceFactory<
  PromotionRuleValue,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.PromotionRuleValueDTO
    list: PromotionTypes.PromotionRuleValueDTO
    listAndCount: PromotionTypes.PromotionRuleValueDTO
    create: CreatePromotionRuleValueDTO
    update: UpdatePromotionRuleValueDTO
  },
  {
    list: PromotionTypes.FilterablePromotionRuleValueProps
    listAndCount: PromotionTypes.FilterablePromotionRuleValueProps
  }
>(PromotionRuleValue) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
