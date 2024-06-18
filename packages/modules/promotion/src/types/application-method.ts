import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  BigNumberInput,
  PromotionDTO,
} from "@medusajs/types"

import { Promotion } from "@models"

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: BigNumberInput
  currency_code?: string | null
  promotion: Promotion | string | PromotionDTO
  max_quantity?: BigNumberInput | null
  buy_rules_min_quantity?: BigNumberInput | null
  apply_to_quantity?: BigNumberInput | null
}

export interface UpdateApplicationMethodDTO {
  id?: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: BigNumberInput
  currency_code?: string | null
  promotion?: Promotion | string | PromotionDTO
  max_quantity?: BigNumberInput | null
  buy_rules_min_quantity?: BigNumberInput | null
  apply_to_quantity?: BigNumberInput | null
}
