import { DAL, PromotionTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Campaign } from "@models"
import { CreateCampaignDTO, UpdateCampaignDTO } from "../types"

type InjectedDependencies = {
  campaignRepository: DAL.RepositoryService
}

export default class CampaignService<
  TEntity extends Campaign = Campaign
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateCampaignDTO
    update: UpdateCampaignDTO
  },
  {
    list: PromotionTypes.FilterableCampaignProps
    listAndCount: PromotionTypes.FilterableCampaignProps
  }
>(Campaign)<TEntity> {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
