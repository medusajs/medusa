import { CampaignBudgetTypeValues } from "../../../promotion"
import { PaginatedResponse } from "../../common"

export interface CampaignResponse {
  id: string
  name: string
  description: string
  currency: string
  campaign_identifier: string
  starts_at: string
  ends_at: string
  budget: {
    id: string
    type: CampaignBudgetTypeValues
    currency_code: string
    limit: number
    used: number
  }
}

export type AdminCampaignListResponse = PaginatedResponse<{
  campaigns: CampaignResponse[]
}>

export interface AdminCampaignResponse {
  campaign: CampaignResponse
}
