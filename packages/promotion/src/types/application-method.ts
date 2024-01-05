import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  PromotionDTO,
} from "@medusajs/types"

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodType
  target_type: ApplicationMethodTargetType
  allocation?: ApplicationMethodAllocation
  value?: number
  promotion: PromotionDTO | string
  max_quantity?: number
}

export interface UpdateApplicationMethodDTO {
  id: string
}
