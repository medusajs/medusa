import { BaseFilterable } from "../../dal"

export type CampaignBudgetTypeValues = "spend" | "usage"

export interface CampaignBudgetDTO {
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
