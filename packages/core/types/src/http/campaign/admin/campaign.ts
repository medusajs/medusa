import { PaginatedResponse } from "../../common"

/**
 * @experimental
 */
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
    type: string
    limit: number | null
    used: number
  }
}

/**
 * @experimental
 */
export interface AdminCampaignListResponse extends PaginatedResponse {
  campaigns: CampaignResponse[]
}

/**
 * @experimental
 */
export interface AdminCampaignResponse {
  campaign: CampaignResponse
}
