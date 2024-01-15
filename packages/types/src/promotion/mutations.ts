import { CampaignBudgetTypeValues, PromotionDTO } from "./common"

export interface CreateCampaignBudgetDTO {
  type: CampaignBudgetTypeValues
  limit: number | null
  used?: number
}

export interface UpdateCampaignBudgetDTO {
  id: string
  type?: CampaignBudgetTypeValues
  limit?: number | null
  used?: number
}

export interface CreateCampaignDTO {
  name: string
  description?: string
  currency?: string
  campaign_identifier: string
  starts_at: Date
  ends_at: Date
  budget?: CreateCampaignBudgetDTO
  promotions?: Pick<PromotionDTO, "id">[]
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  budget?: Omit<UpdateCampaignBudgetDTO, "id">
  promotions?: Pick<PromotionDTO, "id">[]
}
