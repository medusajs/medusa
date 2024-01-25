import { CampaignBudgetTypeValues, PromotionTypes } from "@medusajs/types"
import { Campaign, CampaignBudget } from "@models"
import { AbstractService } from "@medusajs/utils"
import { ICampaignBudgetRepository } from "./repositories"

export interface ICampaignBudgetService<
  TEntity extends CampaignBudget = CampaignBudget
> extends AbstractService<
    TEntity,
    { campaignBudgetRepository: ICampaignBudgetRepository<TEntity> },
    {
      create: CreateCampaignBudgetDTO
      update: UpdateCampaignBudgetDTO
    },
    {
      list: PromotionTypes.FilterableCampaignBudgetProps
      listAndCount: PromotionTypes.FilterableCampaignBudgetProps
    }
  > {}

export interface CreateCampaignBudgetDTO {
  type: CampaignBudgetTypeValues
  limit: number | null
  used?: number
  campaign?: Campaign | string
}

export interface UpdateCampaignBudgetDTO {
  id: string
  type?: CampaignBudgetTypeValues
  limit?: number | null
  used?: number
}
