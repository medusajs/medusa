import { 
  ApplicationMethodAllocationValues, 
  ApplicationMethodTargetTypeValues, 
  ApplicationMethodTypeValues, 
  PromotionRuleOperatorValues, 
  PromotionTypeValues
} from "../../promotion"
import { AdminCampaign } from "../campaign"

export interface BasePromotionRule {
  id: string
  description?: string | null
  attribute?: string
  operator?: PromotionRuleOperatorValues
  values: BasePromotionRuleValue[]
}

export interface BaseApplicationMethod {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: number
  currency_code?: string
  max_quantity?: number | null
  buy_rules_min_quantity?: number | null
  apply_to_quantity?: number | null
  promotion?: BasePromotion
  target_rules?: BasePromotionRule[]
  buy_rules?: BasePromotionRule[]
}

export interface BasePromotion {
  id: string
  code?: string
  type?: PromotionTypeValues
  is_automatic?: boolean
  application_method?: BaseApplicationMethod
  rules?: BasePromotionRule[]
  campaign_id?: string
  campaign?: AdminCampaign
}

export interface BasePromotionRuleValue {
  id: string
  value?: string
}

export interface BaseRuleAttributeOptions {
  id: string
  value: string
  label: string
  field_type: string
  required: boolean
  disguised: boolean
  operators: BaseRuleOperatorOptions[]
}

export interface BaseRuleOperatorOptions {
  id: string
  value: string
  label: string
}

export interface BaseRuleValueOptions {
  id: string
  value: string
  label: string
}