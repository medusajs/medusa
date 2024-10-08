import { CampaignBudgetTypeValues } from "../../../promotion"

export interface AdminCreateCampaign {
  name?: string
  description?: string
  currency?: string | null
  campaign_identifier?: string
  starts_at?: Date | null
  ends_at?: Date | null
  budget?: {
    type?: CampaignBudgetTypeValues
    currency_code?: string | null
    limit?: number | null
  } | null
}

export interface AdminUpdateCampaign {
  name?: string
  description?: string
  currency?: string | null
  campaign_identifier?: string
  starts_at?: Date | null
  ends_at?: Date | null
  budget?: {
    type?: CampaignBudgetTypeValues
    currency_code?: string | null
    limit?: number | null
  } | null
}
