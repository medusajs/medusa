import { DAL, PromotionTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { CampaignBudget } from "@models"
import { CreateCampaignBudgetDTO, UpdateCampaignBudgetDTO } from "../types"

type InjectedDependencies = {
  campaignBudgetRepository: DAL.RepositoryService
}

export default class CampaignBudgetService<
  TEntity extends CampaignBudget = CampaignBudget
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateCampaignBudgetDTO
    update: UpdateCampaignBudgetDTO
  },
  {
    list: PromotionTypes.FilterableCampaignBudgetProps
    listAndCount: PromotionTypes.FilterableCampaignBudgetProps
  }
>(CampaignBudget)<TEntity> {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
