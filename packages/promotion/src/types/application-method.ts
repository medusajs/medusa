import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionDTO,
} from "@medusajs/types"

import { Promotion } from "@models"

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  promotion: Promotion | string | PromotionDTO
  max_quantity?: number | null
}

export interface UpdateApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  promotion?: Promotion | string | PromotionDTO
  max_quantity?: number | null
}
