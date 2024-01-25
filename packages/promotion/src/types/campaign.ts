import { PromotionDTO, PromotionTypes } from "@medusajs/types"
import { Campaign, Promotion } from "@models"
import { AbstractService } from "@medusajs/utils"
import { CampaignRepository } from "@repositories"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICampaignService<TEntity extends Campaign = Campaign>
  extends AbstractService<
    TEntity,
    { campaignRepository: CampaignRepository },
    {
      create: CreateCampaignDTO
      update: UpdateCampaignDTO
    },
    {
      list: PromotionTypes.FilterableCampaignProps
      listAndCount: PromotionTypes.FilterableCampaignProps
    }
  > {}

export interface CreateCampaignDTO {
  name: string
  description?: string
  currency?: string
  campaign_identifier: string
  starts_at: Date
  ends_at: Date
  promotions?: (PromotionDTO | Promotion)[]
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  promotions?: (PromotionDTO | Promotion)[]
}
