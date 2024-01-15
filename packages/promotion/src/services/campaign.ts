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
  Campaign,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.CampaignDTO
    list: PromotionTypes.CampaignDTO
    listAndCount: PromotionTypes.CampaignDTO
    create: CreateCampaignDTO
    update: UpdateCampaignDTO
  },
  {
    list: PromotionTypes.FilterableCampaignProps
    listAndCount: PromotionTypes.FilterableCampaignProps
  }
>(Campaign) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
