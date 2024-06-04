import { BigNumberInput, CampaignBudgetTypeValues } from "@medusajs/types"
import { Campaign } from "@models"

export interface CreateCampaignBudgetDTO {
  type?: CampaignBudgetTypeValues
  limit?: BigNumberInput | null
  currency_code?: string | null
  used?: BigNumberInput
  campaign?: Campaign | string
}

export interface UpdateCampaignBudgetDTO {
  id: string
  type?: CampaignBudgetTypeValues
  limit?: BigNumberInput | null
  currency_code?: string | null
  used?: BigNumberInput
}
