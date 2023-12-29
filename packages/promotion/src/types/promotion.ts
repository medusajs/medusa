import { PromotionType } from "@medusajs/types"

export interface CreatePromotionDTO {
  code: string
  type: PromotionType
  is_automatic?: boolean
}

export interface UpdatePromotionDTO {
  id: string
}
