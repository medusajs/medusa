import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionRuleOperatorValues,
  PromotionTypeValues,
} from "../../../promotion"
import { AdminCreateCampaign } from "../../campaign"

export interface AdminCreatePromotionRule {
  operator: PromotionRuleOperatorValues
  description?: string | null
  attribute: string
  values: string | string[]
}

export interface AdminUpdatePromotionRule {
  id: string
  operator?: PromotionRuleOperatorValues
  description?: string | null
  attribute?: string
  values: string | string[]
}

export interface AdminCreateApplicationMethod {
  description?: string | null
  value: number
  currency_code?: string | null
  max_quantity?: number | null
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  target_rules?: AdminCreatePromotionRule[]
  buy_rules?: AdminCreatePromotionRule[]
  apply_to_quantity?: number | null
  buy_rules_min_quantity?: number | null
}

export interface AdminUpdateApplicationMethod {
  description?: string | null
  value?: number
  max_quantity?: number | null
  currency_code?: string | null
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  target_rules?: AdminCreatePromotionRule[]
  buy_rules?: AdminCreatePromotionRule[]
  apply_to_quantity?: number | null
  buy_rules_min_quantity?: number | null
}

export interface AdminCreatePromotion {
  code: string
  is_automatic?: boolean
  type: PromotionTypeValues
  campaign_id?: string | null
  campaign?: AdminCreateCampaign
  application_method: AdminCreateApplicationMethod
  rules?: AdminCreatePromotionRule[]
}

export interface AdminUpdatePromotion {
  code?: string
  is_automatic?: boolean
  type?: PromotionTypeValues
  campaign_id?: string | null
  campaign?: AdminCreateCampaign
  application_method?: AdminUpdateApplicationMethod
  rules?: AdminCreatePromotionRule[]
}

export interface BatchAddPromotionRulesReq {
  rules: AdminCreatePromotionRule[]
}

export interface BatchRemovePromotionRulesReq {
  rule_ids: string[]
}

export interface BatchUpdatePromotionRulesReq {
  rules: AdminUpdatePromotionRule[]
}
