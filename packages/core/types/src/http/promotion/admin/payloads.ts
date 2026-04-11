import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionRuleOperatorValues,
  PromotionStatusValues,
  PromotionTypeValues,
} from "../../../promotion"
import { AdminCreateCampaign } from "../../campaign"

export interface AdminCreatePromotionRule {
  /**
   * The operator used to check whether the buy rule applies on a cart.
   * For example, `eq` means that the cart's value for the specified attribute
   * must match the specified value.
   */
  operator: PromotionRuleOperatorValues
  /**
   * The description of the promotion rule.
   */
  description?: string | null
  /**
   * The attribute to compare against when checking whether a promotion can be applied on a cart.
   *
   * @example
   * items.product_id
   */
  attribute: string
  /**
   * The value to compare against when checking whether a promotion can be applied on a cart.
   *
   * @example
   * prod_123
   */
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
  /**
   * The description of the application method.
   */
  description?: string | null
  /**
   * The value of the application method.
   */
  value: number
  /**
   * The currency code of the application method.
   *
   * @example
   * usd
   */
  currency_code?: string | null
  /**
   * The max quantity allowed in the cart for the associated promotion to be applied.
   */
  max_quantity?: number | null
  /**
   * The type of the application method.
   */
  type: ApplicationMethodTypeValues
  /**
   * The target type of the application method indicating whether the associated promotion is applied
   * to the cart's items, shipping methods, or the whole order.
   */
  target_type: ApplicationMethodTargetTypeValues
  /**
   * The allocation value that indicates whether the associated promotion is applied on each
   * item in a cart or split between the items in the cart.
   */
  allocation?: ApplicationMethodAllocationValues
  /**
   * The target rules of the application method.
   */
  target_rules?: AdminCreatePromotionRule[]
  /**
   * The buy rules of the application method.
   */
  buy_rules?: AdminCreatePromotionRule[]
  /**
   * The quantity of the application method.
   */
  apply_to_quantity?: number | null
  /**
   * The minimum quantity required for a `buyget` promotion to be applied. For example,
   * if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is 2.
   */
  buy_rules_min_quantity?: number | null
}

export interface AdminUpdateApplicationMethod {
  /**
   * The description of the application method.
   */
  description?: string | null
  /**
   * The value of the application method.
   */
  value?: number
  /**
   * The max quantity allowed in the cart for the associated promotion to be applied.
   */
  max_quantity?: number | null
  /**
   * The currency code of the application method.
   *
   * @example
   * usd
   */
  currency_code?: string | null
  /**
   * The type of the application method.
   */
  type?: ApplicationMethodTypeValues
  /**
   * The target type of the application method indicating whether the associated promotion is applied
   * to the cart's items, shipping methods, or the whole order.
   */
  target_type?: ApplicationMethodTargetTypeValues
  /**
   * The allocation value that indicates whether the associated promotion is applied on each
   * item in a cart or split between the items in the cart.
   */
  allocation?: ApplicationMethodAllocationValues
  /**
   * The target rules of the application method.
   */
  target_rules?: AdminCreatePromotionRule[]
  /**
   * The buy rules of the application method.
   */
  buy_rules?: AdminCreatePromotionRule[]
  /**
   * The quantity of the application method.
   */
  apply_to_quantity?: number | null
  /**
   * The minimum quantity required for a `buyget` promotion to be applied. For example,
   * if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is 2.
   */
  buy_rules_min_quantity?: number | null
}

export interface AdminCreatePromotion {
  /**
   * The promotion's code.
   */
  code: string
  /**
   * Whether the promotion is applied automatically
   * or requires the customer to manually apply it
   * by entering the code at checkout.
   */
  is_automatic?: boolean
  /**
   * Whether the promotion is tax inclusive.
   */
  is_tax_inclusive?: boolean
  /**
   * The type of promotion.
   */
  type: PromotionTypeValues
  /**
   * The ID of the campaign that the promotion belongs to.
   */
  campaign_id?: string | null
  /**
   * The campaign that the promotion belongs to.
   */
  campaign?: AdminCreateCampaign
  /**
   * The application method of the promotion.
   */
  application_method: AdminCreateApplicationMethod
  /**
   * The maximum number of times this promotion can be used.
   */
  limit?: number | null
  /**
   * The rules of the promotion.
   */
  rules?: AdminCreatePromotionRule[]
}

export interface AdminUpdatePromotion {
  /**
   * The promotion's code.
   */
  code?: string
  /**
   * Whether the promotion is applied automatically
   * or requires the customer to manually apply it
   * by entering the code at checkout.
   */
  is_automatic?: boolean
  /**
   * Whether the promotion is tax inclusive.
   */
  is_tax_inclusive?: boolean
  /**
   * The type of promotion.
   */
  type?: PromotionTypeValues
  /**
   * The status of the promotion.
   */
  status?: PromotionStatusValues
  /**
   * The ID of the campaign that the promotion belongs to.
   */
  campaign_id?: string | null
  /**
   * The campaign that the promotion belongs to.
   */
  campaign?: AdminCreateCampaign
  /**
   * The application method of the promotion.
   */
  application_method?: AdminUpdateApplicationMethod
  /**
   * The maximum number of times this promotion can be used.
   */
  limit?: number | null
  /**
   * The rules of the promotion.
   */
  rules?: AdminCreatePromotionRule[]
}

export interface BatchAddPromotionRulesReq {
  /**
   * The rules to add.
   */
  rules: AdminCreatePromotionRule[]
}

export interface BatchRemovePromotionRulesReq {
  /**
   * The IDs of the rules to remove.
   */
  rule_ids: string[]
}

export interface BatchUpdatePromotionRulesReq {
  /**
   * The rules to update.
   */
  rules: AdminUpdatePromotionRule[]
}
