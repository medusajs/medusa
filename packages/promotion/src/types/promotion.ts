import { PromotionType } from "@medusajs/types"

export interface CreatePromotionDTO {
  code: string
  type: PromotionType
  is_automatic?: boolean
}

export interface UpdatePromotionDTO {
  id: string
  code?: string
  // TODO: add this when buyget is available
  // type: PromotionType
  is_automatic?: boolean
}
