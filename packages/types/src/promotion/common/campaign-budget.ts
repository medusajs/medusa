import { BaseFilterable } from "../../dal"

export type CampaignBudgetTypeValues = "spend" | "usage"

export interface CampaignBudgetDTO {
  id: string
  type?: CampaignBudgetTypeValues
  limit?: string | null
  used?: string
}

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

export interface FilterableCampaignBudgetProps
  extends BaseFilterable<FilterableCampaignBudgetProps> {
  id?: string[]
  type?: string[]
}
