import { BaseFilterable } from "../../dal"
import { PromotionDTO } from "./promotion"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

export type ApplicationMethodTypeValues = "fixed" | "percentage"
export type ApplicationMethodTargetTypeValues = "order" | "shipping" | "item"
export type ApplicationMethodAllocationValues = "each" | "across"

export interface ApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  max_quantity?: number | null
  promotion?: PromotionDTO | string
  target_rules?: PromotionRuleDTO[]
}

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  max_quantity?: number | null
  promotion?: PromotionDTO | string
  target_rules?: CreatePromotionRuleDTO[]
}

export interface UpdateApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  max_quantity?: number | null
  promotion?: PromotionDTO | string
}

export interface FilterableApplicationMethodProps
  extends BaseFilterable<FilterableApplicationMethodProps> {
  id?: string[]
  type?: ApplicationMethodTypeValues[]
  target_type?: ApplicationMethodTargetTypeValues[]
  allocation?: ApplicationMethodAllocationValues[]
}
