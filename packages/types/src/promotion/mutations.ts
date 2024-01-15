import { CampaignBudgetTypeValues } from "./common"

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
}
