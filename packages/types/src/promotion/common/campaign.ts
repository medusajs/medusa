import { BaseFilterable } from "../../dal"
import { CampaignBudgetDTO } from "./campaign-budget"

export interface CampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  budget?: CampaignBudgetDTO
}

export interface FilterableCampaignProps
  extends BaseFilterable<FilterableCampaignProps> {
  id?: string[]
  campaign_identifier?: string[]
}
