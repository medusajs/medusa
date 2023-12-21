import { BaseFilterable } from "../../dal"
import { CreateApplicationMethodDTO } from "./application-method"

export type PromotionType = "standard" | "buyget"

export interface PromotionDTO {
  id: string
}

export interface CreatePromotionDTO {
  code: string
  type: PromotionType
  is_automatic?: boolean
  application_method?: CreateApplicationMethodDTO
}

export interface UpdatePromotionDTO {
  id: string
}

export interface FilterablePromotionProps
  extends BaseFilterable<FilterablePromotionProps> {
  id?: string[]
  code?: string[]
  is_automatic?: boolean
  type?: PromotionType[]
}
