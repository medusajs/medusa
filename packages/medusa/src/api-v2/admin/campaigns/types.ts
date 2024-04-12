import { CampaignDTO, PaginatedResponse } from "@medusajs/types"

export type AdminCampaignsListRes = PaginatedResponse<{
  campaigns: CampaignDTO[]
}>

export type AdminCampaignRes = {
  campaign: CampaignDTO
}
