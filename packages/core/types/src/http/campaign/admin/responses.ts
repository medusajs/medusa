import { CampaignBudgetTypeValues } from "../../../promotion"
import { DeleteResponse, PaginatedResponse } from "../../common"

export interface AdminCampaign {
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
  campaigns: AdminCampaign[]
}>

export interface AdminCampaignResponse {
  campaign: AdminCampaign
}

export type AdminCampaignDeleteResponse = DeleteResponse<"campaign">