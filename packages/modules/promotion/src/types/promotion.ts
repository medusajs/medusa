import { PromotionTypeValues } from "@medusajs/framework/types"

export interface CreatePromotionDTO {
  code: string
  type: PromotionTypeValues
  is_automatic?: boolean
  campaign_id?: string | null
}

export interface UpdatePromotionDTO {
  id: string
  code?: string
  type?: PromotionTypeValues
  is_automatic?: boolean
  campaign_id?: string | null
}
