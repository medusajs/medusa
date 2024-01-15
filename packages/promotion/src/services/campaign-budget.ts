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
  CampaignBudget,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.CampaignBudgetDTO
    list: PromotionTypes.CampaignBudgetDTO
    listAndCount: PromotionTypes.CampaignBudgetDTO
    create: CreateCampaignBudgetDTO
    update: UpdateCampaignBudgetDTO
  },
  {
    list: PromotionTypes.FilterableCampaignBudgetProps
    listAndCount: PromotionTypes.FilterableCampaignBudgetProps
  }
>(CampaignBudget) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
