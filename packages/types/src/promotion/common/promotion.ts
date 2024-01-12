import { BaseFilterable } from "../../dal"
import {
  ApplicationMethodDTO,
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "./application-method"
import { CreatePromotionRuleDTO } from "./promotion-rule"

export type PromotionType = "standard" | "buyget"

export interface PromotionDTO {
  id: string
  code?: string
  type?: PromotionType
  is_automatic?: boolean
  application_method?: ApplicationMethodDTO
}

export interface CreatePromotionDTO {
  code: string
  type: PromotionType
  is_automatic?: boolean
  application_method?: CreateApplicationMethodDTO
  rules?: CreatePromotionRuleDTO[]
}

export interface UpdatePromotionDTO {
  id: string
  is_automatic?: boolean
  code?: string
  type?: PromotionType
  application_method?: UpdateApplicationMethodDTO
}

export interface FilterablePromotionProps
  extends BaseFilterable<FilterablePromotionProps> {
  id?: string[]
  code?: string[]
  is_automatic?: boolean
  type?: PromotionType[]
}
