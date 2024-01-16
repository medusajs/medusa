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
  InjectedDependencies,
  {
    create: CreatePromotionRuleValueDTO
    update: UpdatePromotionRuleValueDTO
  },
  {
    list: PromotionTypes.FilterablePromotionRuleValueProps
    listAndCount: PromotionTypes.FilterablePromotionRuleValueProps
  }
>(PromotionRuleValue)<TEntity> {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
