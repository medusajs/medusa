import { PromotionDTO } from "@medusajs/types"
import { Promotion } from "@models"

export interface CreateCampaignDTO {
  name: string
  description?: string | null
  campaign_identifier: string
  starts_at?: Date | null
  ends_at?: Date | null
  promotions?: (PromotionDTO | Promotion)[]
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string | null
  campaign_identifier?: string
  starts_at?: Date | null
  ends_at?: Date | null
  promotions?: (PromotionDTO | Promotion)[]
}
