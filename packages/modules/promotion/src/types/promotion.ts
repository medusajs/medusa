import { PromotionTypeValues } from "@medusajs/types"

export interface CreatePromotionDTO {
  code: string
  type: PromotionTypeValues
  is_automatic?: boolean
  campaign_id?: string
}

export interface UpdatePromotionDTO {
  id: string
  code?: string
  type?: PromotionTypeValues
  is_automatic?: boolean
  campaign_id?: string
}
