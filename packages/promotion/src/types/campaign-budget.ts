import { CampaignBudgetTypeValues } from "@medusajs/types"
import { Campaign } from "@models"

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
