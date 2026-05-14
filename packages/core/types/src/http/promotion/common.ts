import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionRuleOperatorValues,
  PromotionStatusValues,
  PromotionTypeValues,
} from "../../promotion"
import { AdminCampaign } from "../campaign"

export interface BasePromotionRule {
  /**
   * The rule's ID.
   */
  id: string
  /**
   * The rule's description.
   */
  description?: string | null
  /**
   * The attribute to compare against when checking whether a promotion can be applied on a cart.
   *
   * @example
   * items.product_id
   */
  attribute?: string
  /**
   * The operator used to check whether the buy rule applies on a cart.
   * For example, `eq` means that the cart's value for the specified attribute
   * must match the specified value.
   *
   * @example
   * eq
   */
  operator?: PromotionRuleOperatorValues
  /**
   * The values to compare against when checking whether a promotion can be applied on a cart.
   *
   * @example
   * prod_123
   */
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
  is_tax_inclusive?: boolean
  limit?: number | null
  used?: number
  application_method?: BaseApplicationMethod
  rules?: BasePromotionRule[]
  status?: PromotionStatusValues
  campaign_id?: string
  campaign?: AdminCampaign
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface BasePromotionRuleValue {
  /**
   * The rule value's ID.
   */
  id: string
  /**
   * The rule value's value.
   */
  value?: string
}

export interface BaseRuleAttributeOptions {
  /**
   * The rule attribute option's ID.
   */
  id: string
  /**
   * The rule attribute option's value.
   */
  value: string
  /**
   * The rule attribute option's label.
   */
  label: string
  /**
   * @ignore
   */
  field_type: string
  /**
   * @ignore
   */
  required: boolean
  /**
   * @ignore
   */
  disguised?: boolean
  /**
   * @ignore
   */
  hydrate?: boolean
  /**
   * The attribute option's operators.
   */
  operators: BaseRuleOperatorOptions[]
}

export interface BaseRuleOperatorOptions {
  /**
   * The operator option's ID.
   */
  id: string
  /**
   * The operator option's value.
   */
  value: string
  /**
   * The operator option's label.
   */
  label: string
}

export interface BaseRuleValueOptions {
  value: string
  label: string
}
