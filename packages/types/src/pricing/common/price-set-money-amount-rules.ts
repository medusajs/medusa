import { BaseFilterable } from "../../dal"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * A price set money amount rule's data.
 */
export interface PriceSetMoneyAmountRulesDTO {
  /**
   * The ID of the price set money amount.
   */
  id: string
  /**
   * The associated price set money amount.
   * 
   * @expandable
   */
  price_set_money_amount: PriceSetMoneyAmountDTO
  /**
   * The associated rule type.
   * 
   * @expandable
   */
  rule_type: RuleTypeDTO
  /**
   * The value of the price set money amount rule.
   */
  value: string
}

/**
 * @interface
 * 
 * The price set money amount rule to create.
 */
export interface CreatePriceSetMoneyAmountRulesDTO {
  /**
   * The ID of a price set money amount.
   */
  price_set_money_amount: string
  /**
   * The ID of a rule type.
   */
  rule_type: string
  /**
   * The value of the price set money amount rule.
   */
  value: string
}

/**
 * @interface
 * 
 * The data to update in a price set money amount rule. The `id` is used to identify which money amount to update.
 */
export interface UpdatePriceSetMoneyAmountRulesDTO {
  /**
   * The ID of the price set money amount rule to update.
   */
  id: string
  /**
   * The ID of a price set money amount.
   */
  price_set_money_amount?: string
  /**
   * The ID of a rule type.
   */
  rule_type?: string
  /**
   * The value of the price set money amount rule.
   */
  value?: string
}

/**
 * @interface
 * 
 * Filters to apply on price set money amount rules.
 */
export interface FilterablePriceSetMoneyAmountRulesProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountRulesProps> {
  /**
   * The ID to filter price set money amount rules by.
   */
  id?: string[]
  /**
   * The IDs to filter the price set money amount rule's associated rule type.
   */
  rule_type_id?: string[]
  /**
   * The IDs to filter the price set money amount rule's associated price set money amount.
   */
  price_set_money_amount_id?: string[]
  /**
   * The value to filter price set money amount rules by.
   */
  value?: string[]
}
