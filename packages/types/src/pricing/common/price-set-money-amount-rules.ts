import { BaseFilterable } from "../../dal"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * A price set money amount rule's data.
 * 
 * @prop id - The ID of the price set money amount.
 * @prop price_set_money_amount - The associated price set money amount. It may only be available if the relation `price_set_money_amount` is expanded.
 * @prop rule_type - The associated rule type. It may only be available if the relation `rule_type` is expanded.
 * @prop value - The value of the price set money amount rule.
 */
export interface PriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount: PriceSetMoneyAmountDTO
  rule_type: RuleTypeDTO
  value: string
}

/**
 * @interface
 * 
 * The price set money amount rule to create.
 * 
 * @prop price_set_money_amount - The ID of a price set money amount.
 * @prop rule_type - The ID of a rule type.
 * @prop value - The value of the price set money amount rule.
 */
export interface CreatePriceSetMoneyAmountRulesDTO {
  price_set_money_amount: string
  rule_type: string
  value: string
}

/**
 * @interface
 * 
 * The data to update in a price set money amount rule. The `id` is used to identify which money amount to update.
 * 
 * @prop id - The ID of the price set money amount rule to update.
 * @prop price_set_money_amount - The ID of a price set money amount.
 * @prop rule_type - The ID of a rule type.
 * @prop value - The value of the price set money amount rule.
 */
export interface UpdatePriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount?: string
  rule_type?: string
  value?: string
}

/**
 * @interface
 * 
 * Filters to apply on price set money amount rules.
 * 
 * @prop id - The ID to filter price set money amount rules by.
 * @prop rule_type_id - The IDs to filter the price set money amount rule's associated rule type.
 * @prop price_set_money_amount_id - The IDs to filter the price set money amount rule's associated price set money amount.
 * @prop value - The value to filter price set money amount rules by.
 */
export interface FilterablePriceSetMoneyAmountRulesProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountRulesProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_money_amount_id?: string[]
  value?: string[]
}
