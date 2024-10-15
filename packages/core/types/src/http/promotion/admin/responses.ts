import { BatchResponse, DeleteResponse, PaginatedResponse } from "../../common"
import {
  AdminPromotion,
  AdminPromotionRule,
  AdminRuleAttributeOption,
  AdminRuleOperatorOption,
  AdminRuleValueOption,
} from "./entities"

export interface AdminPromotionResponse {
  promotion: AdminPromotion
}

export type AdminPromotionListResponse = PaginatedResponse<{
  promotions: AdminPromotion[]
}>

export interface PromotionRuleResponse {
  rule: AdminPromotionRule
}

export type AdminPromotionRuleListResponse = {
  rules: AdminPromotionRule[]
}

export interface RuleAttributeOptionsResponse {
  attribute: AdminRuleAttributeOption[]
}

export type AdminRuleAttributeOptionsListResponse = {
  attributes: AdminRuleAttributeOption[]
}

export interface RuleOperatorOptionsResponse {
  operator: AdminRuleOperatorOption
}

export type AdminRuleOperatorOptionsListResponse = PaginatedResponse<{
  operators: AdminRuleOperatorOption[]
}>

/**
 * @experimental
 */
export interface RuleValueOptionsResponse {
  value: AdminRuleValueOption
}

/**
 * @experimental
 */
export type AdminRuleValueOptionsListResponse = {
  values: AdminRuleValueOption[]
}

export type AdminPromotionRuleBatchResponse = BatchResponse<AdminPromotionRule>

export type AdminPromotionDeleteResponse = DeleteResponse<"promotion">
