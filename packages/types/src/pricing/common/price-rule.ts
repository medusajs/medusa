import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * A price rule's data.
 * 
 * @prop id - The ID of the price rule.
 * @prop price_set_id - The ID of the associated price set.
 * @prop price_set - The associated price set. It may only be available if the relation `price_set` is expanded.
 * @prop rule_type_id - The ID of the associated rule type.
 * @prop rule_type - The associated rule type. It may only be available if the relation `rule_type` is expanded.
 * @prop value - The value of the price rule.
 * @prop priority - The priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - The ID of the associated price set money amount.
 * @prop price_list_id - The ID of the associated price list.
 */
export interface PriceRuleDTO {
  id: string
  price_set_id: string
  price_set: PriceSetDTO
  rule_type_id: string
  rule_type: RuleTypeDTO
  /** 
   * @ignore
   * @privateRemark
   * 
   * Behavior behind this property is not implemented yet.
   */
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
 * A price rule to create.
 * 
 * @prop id - The ID of the price rule.
 * @prop price_set_id - The ID of the associated price set.
 * @prop rule_type_id - The ID of the associated rule type.
 * @prop value - The value of the price rule.
 * @prop priority - The priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - The ID of the associated price set money amount.
 * @prop price_list_id - The ID of the associated price list.
 */
export interface CreatePriceRuleDTO {
  id: string
  price_set_id: string
  rule_type_id: string
  /** 
   * @ignore
   * @privateRemark
   * 
   * Behavior behind this property is not implemented yet.
   */
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
 * The data to update in a price rule. The `id` is used to identify which money amount to update.
 * 
 * @prop id - The ID of the price rule to update.
 * @prop price_set_id - The ID of the associated price set.
 * @prop rule_type_id - The ID of the associated rule type.
 * @prop value - The value of the price rule.
 * @prop priority - The priority of the price rule in comparison to other applicable price rules.
 * @prop price_set_money_amount_id - The ID of the associated price set money amount.
 * @prop price_list_id - The ID of the associated price list.
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
 * Filters to apply to price rules.
 * 
 * @prop id - The IDs to filter price rules by.
 * @prop name - The names to filter price rules by.
 * @prop price_set_id - The IDs to filter the price rule's associated price set.
 * @prop rule_type_id - The IDs to filter the price rule's associated rule type.
 */
export interface FilterablePriceRuleProps
  extends BaseFilterable<FilterablePriceRuleProps> {
  id?: string[]
  name?: string[]
  price_set_id?: string[]
  rule_type_id?: string[]
}
