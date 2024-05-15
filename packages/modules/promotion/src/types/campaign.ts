import { PromotionDTO } from "@medusajs/types"
import { Promotion } from "@models"

export interface CreateCampaignDTO {
  name: string
  description?: string
  currency: string
  campaign_identifier: string
  starts_at?: Date
  ends_at?: Date
  promotions?: (PromotionDTO | Promotion)[]
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  promotions?: (PromotionDTO | Promotion)[]
}
