import { BaseFilterable } from "../../dal"
import { PromotionDTO } from "./promotion"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

export type ApplicationMethodTypeValues = "fixed" | "percentage"
export type ApplicationMethodTargetTypeValues =
  | "order"
  | "shipping_methods"
  | "items"
export type ApplicationMethodAllocationValues = "each" | "across"

export interface ApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: number
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
  promotion?: PromotionDTO | string
  target_rules?: PromotionRuleDTO[]
  buy_rules?: PromotionRuleDTO[]
}

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: number
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
  promotion?: PromotionDTO | string
  target_rules?: CreatePromotionRuleDTO[]
  buy_rules?: CreatePromotionRuleDTO[]
}

export interface UpdateApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: number
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
  promotion?: PromotionDTO | string
}

export interface FilterableApplicationMethodProps
  extends BaseFilterable<FilterableApplicationMethodProps> {
  id?: string[]
  type?: ApplicationMethodTypeValues[]
  target_type?: ApplicationMethodTargetTypeValues[]
  allocation?: ApplicationMethodAllocationValues[]
}
