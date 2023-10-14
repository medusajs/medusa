import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * An object that represents a price rule.
 * 
 * @prop id - A string indicating the ID of the price rule.
 * @prop price_set_id - A string indicating the ID of the associated price set.
 * @prop price_set - An object of type {@link PriceSetDTO} that holds the data of the associated price set. It may only be available if the relation `price_set` is expanded.
 * @prop rule_type_id - A string indicating the ID of the associated rule type.
 * @prop rule_type - An object of type {@link RuleTypeDTO} that holds the data of the associated rule type. It may only be available if the relation `rule_type` is expanded.
 * @prop is_dynamic - A boolean indicating whether the price rule is dynamic.
 * @prop value - A string indicating the value of the price rule.
 * @prop priority - A number indicating the priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - A string indicating the ID of the associated price set money amount.
 * @prop price_list_id - A string indicating the ID of the associated price list.
 */
export interface PriceRuleDTO {
  id: string
  price_set_id: string
  price_set: PriceSetDTO
  rule_type_id: string
  rule_type: RuleTypeDTO
  is_dynamic: boolean
  value: string
  priority: number
  price_set_money_amount_id: string
  price_list_id: string
}

/**
 * 
 * @interface
 * 
 * An object used to specify the necessary data to create a price rule.
 * 
 * @prop id - A string indicating the ID of the price rule.
 * @prop price_set_id - A string indicating the ID of the associated price set.
 * @prop rule_type_id - A string indicating the ID of the associated rule type.
 * @prop is_dynamic - A boolean indicating whether the price rule is dynamic.
 * @prop value - A string indicating the value of the price rule.
 * @prop priority - A number indicating the priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - A string indicating the ID of the associated price set money amount.
 * @prop price_list_id - A string indicating the ID of the associated price list.
 */
export interface CreatePriceRuleDTO {
  id: string
  price_set_id: string
  rule_type_id: string
  is_dynamic?: boolean
  value: string
  priority?: number
  price_set_money_amount_id: string
  price_list_id: string
}

/**
 * 
 * @interface
 * 
 * An object used to specify the necessary data to update a price rule.
 * 
 * @prop id - A string indicating the ID of the price rule to update.
 * @prop price_set_id - A string indicating the ID of the associated price set.
 * @prop rule_type_id - A string indicating the ID of the associated rule type.
 * @prop value - A string indicating the value of the price rule.
 * @prop priority - A number indicating the priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - A string indicating the ID of the associated price set money amount.
 * @prop price_list_id - A string indicating the ID of the associated price list.
 */
export interface UpdatePriceRuleDTO {
  id: string
  price_set_id?: string
  rule_type_id?: string
  /** 
   * @ignore
   * @privateRemark
   * 
   * Behavior behind this property is not implemented yet.
   */
  is_dynamic?: boolean
  value?: string
  priority?: number
  price_set_money_amount_id?: string
  price_list_id?: string
}

/**
 * @interface
 * 
 * An object used to filter price rules when retrieving them.
 * 
 * @prop id - An array of strings, each indicating an ID to filter price rules.
 * @prop name - An array of strings, each indicating a name to filter price rules.
 * @prop price_set_id - An array of strings, each indicating a price set ID to filter price rules.
 * @prop rule_type_id - An array of strings, each indicating a rule type ID to filter rule types.
 */
export interface FilterablePriceRuleProps
  extends BaseFilterable<FilterablePriceRuleProps> {
  id?: string[]
  name?: string[]
  price_set_id?: string[]
  rule_type_id?: string[]
}
