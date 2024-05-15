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
  value?: number
  currency_code: string
  promotion: Promotion | string | PromotionDTO
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
}

export interface UpdateApplicationMethodDTO {
  id?: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: number
  currency_code?: string
  promotion?: Promotion | string | PromotionDTO
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
}
