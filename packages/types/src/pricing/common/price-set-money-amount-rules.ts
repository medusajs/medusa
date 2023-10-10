import { BaseFilterable } from "../../dal"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * An object representing a price set money amount rule, which holds data related to the association between a price set money amount and a rule.
 * 
 * @prop id - A string indicating the ID of the price set money amount.
 * @prop price_set_money_amount - an object of type {@link PriceSetMoneyAmountDTO} holding the data of the associated price set money amount.
 * @prop rule_type - an object of type {@link RuleTypeDTO} holding the data of the associated rule type.
 * @prop value - a string indicating the value of the price set money amount rule.
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
 * An object used to create a price set money amount rule, which represents an association between a price set money amount and a rule type.
 * 
 * @prop price_set_money_amount - A string indicating the ID of a price set money amount.
 * @prop rule_type - A string indicating the ID of a rule type.
 * @prop value - A string indicating the value of the price set money amount rule.
 */
export interface CreatePriceSetMoneyAmountRulesDTO {
  price_set_money_amount: string
  rule_type: string
  value: string
}

/**
 * @interface
 * 
 * An object used to update a price set money amount rule. The price set money amount rule is identified by the provided `id`.
 * 
 * @prop id - A string indicating the ID of the price set money amount rule to update.
 * @prop price_set_money_amount - A string indicating the ID of a price set money amount.
 * @prop rule_type - A string indicating the ID of a rule type.
 * @prop value - A string indicating the value of the price set money amount rule.
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
 * An object used to filter price set money amount rules when listing them.
 * 
 * @prop id - An array of strings, each string indicating an ID to filter the price set money amount rules.
 * @prop rule_type_id - An array of strings, each string indicating the ID of a rule type to filter the price set money amount rules.
 * @prop price_set_money_amount_id - an array of strings, each string indicating the ID of a price set money amount to filter the price set money amount rules.
 * @prop value - an array of strings, each string indicating a value to filter the price set money amount rules.
 */
export interface FilterablePriceSetMoneyAmountRulesProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountRulesProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_money_amount_id?: string[]
  value?: string[]
}
