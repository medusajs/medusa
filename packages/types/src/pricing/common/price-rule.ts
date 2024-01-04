import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 *
 * A price rule's data.
 */
export interface PriceRuleDTO {
  /**
   * The ID of the price rule.
   */
  id: string
  /**
   * The ID of the associated price set.
   */
  price_set_id: string
  /**
   * The associated price set.
   * @expandable
   */
  price_set: PriceSetDTO
  /**
   * The ID of the associated rule type.
   */
  rule_type_id: string
  /**
   * The associated rule type.
   *
   * @expandable
   */
  rule_type: RuleTypeDTO
  /**
   * The value of the price rule.
   */
  value: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority: number
  /**
   * The ID of the associated price set money amount.
   */
  price_set_money_amount_id: string
  /**
   * The ID of the associated price list.
   */
  price_list_id: string
}

/**
 *
 * @interface
 *
 * A price rule to create.
 */
export interface CreatePriceRuleDTO {
  /**
   * The ID of the associated price set.
   */
  price_set_id?: string
  /**
   * The ID or object of the associated price set.
   */
  price_set?: string | PriceSetDTO
  /**
   * The ID of the associated rule type.
   */
  rule_type_id?: string
  /**
   * The ID of the associated rule type.
   */
  rule_type?: string | RuleTypeDTO
  /**
   * The value of the price rule.
   */
  value: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority?: number
  /**
   * The ID of the associated price set money amount.
   */
  price_set_money_amount_id?: string
  /**
   * The ID or object of the associated price set money amount.
   */
  price_set_money_amount?: string | PriceSetMoneyAmountDTO
}

/**
 *
 * @interface
 *
 * The data to update in a price rule. The `id` is used to identify which money amount to update.
 */
export interface UpdatePriceRuleDTO {
  id: string
  price_set_id?: string
  rule_type_id?: string
  /**
   * The value of the price rule.
   */
  value?: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority?: number
  /**
   * The ID of the associated price set money amount.
   */
  price_set_money_amount_id?: string
  /**
   * The ID of the associated price list.
   */
  price_list_id?: string
}

/**
 * @interface
 * Filters to apply on price rules.
 */
export interface FilterablePriceRuleProps
  extends BaseFilterable<FilterablePriceRuleProps> {
  /**
   * The IDs to filter price rules by.
   */
  id?: string[]
  /**
   * The names to filter price rules by.
   */
  name?: string[]
  /**
   * The IDs to filter the price rule's associated price set.
   */
  price_set_id?: string[]
  /**
   * The IDs to filter the price rule's associated rule type.
   */
  rule_type_id?: string[]
}
