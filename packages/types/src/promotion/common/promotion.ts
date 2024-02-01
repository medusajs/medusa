import { BaseFilterable } from "../../dal"
import { CreateCampaignDTO } from "../mutations"
import {
  ApplicationMethodDTO,
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "./application-method"
import { CampaignDTO } from "./campaign"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

export type PromotionTypeValues = "standard" | "buyget"

export interface PromotionDTO {
  id: string
  code?: string
  type?: PromotionTypeValues
  is_automatic?: boolean
  application_method?: ApplicationMethodDTO
  rules?: PromotionRuleDTO[]
  campaign?: CampaignDTO
}

export interface CreatePromotionDTO {
  code: string
  type: PromotionTypeValues
  is_automatic?: boolean
  application_method?: CreateApplicationMethodDTO
  rules?: CreatePromotionRuleDTO[]
  campaign?: CreateCampaignDTO
  campaign_id?: string
}

export interface UpdatePromotionDTO {
  id: string
  is_automatic?: boolean
  code?: string
  type?: PromotionTypeValues
  application_method?: UpdateApplicationMethodDTO
  campaign_id?: string
}

export interface FilterablePromotionProps
  extends BaseFilterable<FilterablePromotionProps> {
  id?: string[]
  code?: string[]
  is_automatic?: boolean
  type?: PromotionTypeValues[]
  budget_id?: string[]
}
