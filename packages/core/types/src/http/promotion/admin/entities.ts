import {
  BaseApplicationMethod,
  BasePromotion,
  BasePromotionRule,
  BaseRuleAttributeOptions,
  BaseRuleOperatorOptions,
  BaseRuleValueOptions,
} from "../common"

export interface AdminPromotion extends BasePromotion {
  application_method?: AdminApplicationMethod
  rules?: AdminPromotionRule[]
}
export interface AdminApplicationMethod extends BaseApplicationMethod {
  promotion?: AdminPromotion
  target_rules?: AdminPromotionRule[]
  buy_rules?: AdminPromotionRule[]
}
export interface AdminPromotionRule extends BasePromotionRule {}
export interface AdminRuleAttributeOption extends BaseRuleAttributeOptions {}
export interface AdminRuleOperatorOption extends BaseRuleOperatorOptions {}
export interface AdminRuleValueOption extends BaseRuleValueOptions {}
