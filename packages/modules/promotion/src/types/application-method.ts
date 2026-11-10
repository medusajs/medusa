import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetSelectionStrategyValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  BigNumberInput,
  InferEntityType,
  PromotionDTO,
} from "@medusajs/framework/types"

import { Promotion } from "@models"

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: BigNumberInput
  currency_code?: string | null
  promotion: InferEntityType<typeof Promotion> | string | PromotionDTO
  max_quantity?: BigNumberInput | null
  buy_rules_min_quantity?: BigNumberInput | null
  apply_to_quantity?: BigNumberInput | null
  target_selection_strategy?: ApplicationMethodTargetSelectionStrategyValues
}

export interface UpdateApplicationMethodDTO {
  id?: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: BigNumberInput
  currency_code?: string | null
  promotion?: InferEntityType<typeof Promotion> | string | PromotionDTO
  max_quantity?: BigNumberInput | null
  buy_rules_min_quantity?: BigNumberInput | null
  apply_to_quantity?: BigNumberInput | null
  target_selection_strategy?: ApplicationMethodTargetSelectionStrategyValues
}
