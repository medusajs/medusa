import { BaseFilterable, OperatorMap } from "../../dal"
import {
  CreateMoneyAmountDTO,
  MoneyAmountDTO,
  UpdateMoneyAmountDTO,
} from "./money-amount"
import { PriceDTO } from "./price"
import { RuleTypeDTO } from "./rule-type"

/**
 * @enum
 *
 * The price list's status.
 */
export type PriceListStatus = "active" | "draft"

/**
 * @enum
 *
 * The price list's type.
 * "sale" - The price list's prices are used for a sale.
 * "override" - The price list's prices override original prices. This affects the calculated price of associated price sets.
 */

export type PriceListType = "sale" | "override"

/**
 * @interface
 *
 * A price list's details.
 */
export interface PriceListDTO {
  /**
   * The price list's ID.
   */
  id: string
  /**
   * The price list's title.
   */
  title?: string
  /**
   * The price list's description.
   */
  description?: string
  /**
   * The price list is enabled starting from this date.
   */
  starts_at?: string | null
  /**
   * The price list's status.
   */
  status?: PriceListStatus
  /**
   * The price list's type.
   */
  type?: PriceListType
  /**
   * The price list expires after this date.
   */
  ends_at?: string | null
  /**
   * The number of rules associated with this price list.
   */
  rules_count?: number
  /**
   * The associated price set money amounts.
   *
   * @expandable
   */
  prices?: PriceDTO[]
  /**
   * The associated money amounts.
   *
   * @expandable
   */
  money_amounts?: MoneyAmountDTO[]
  /**
   * The associated rule types.
   *
   * @expandable
   */
  rule_types?: RuleTypeDTO[]
  /**
   * The price set's rules.
   *
   * @expandable
   */
  rules?: PriceListRuleDTO[]
  /**
   * The price set's rules.
   *
   * @privateRemarks
   * Do we need both this and `rules`?
   *
   * @expandable
   */
  price_list_rules?: PriceListRuleDTO[]
}

/**
 * @interface
 *
 * The prices associated with a price list.
 */
export interface CreatePriceListPriceDTO extends CreateMoneyAmountDTO {
  /**
   * The ID of the associated price set.
   */
  price_set_id: string
  /**
   * The rules to add to the price. The object's keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
   */
  rules?: CreatePriceSetPriceRules
}

export interface UpdatePriceListPriceDTO extends UpdateMoneyAmountDTO {
  /**
   * The ID of the associated price set.
   */
  price_set_id: string
  /**
   * The rules to add to the price. The object's keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
   */
  rules?: CreatePriceSetPriceRules
}

/**
 * @interface
 *
 * The price rules to be set for each price in the price set.
 *
 * Each key of the object is a rule type's `rule_attribute`, and its value
 * is the values of the rule.
 */
export interface CreatePriceSetPriceRules extends Record<string, string> {}

/**
 * @interface
 *
 * The price list's rules to be set. Each key of the object is a rule type's `rule_attribute`, and its value
 * is the values of the rule.
 */
export interface CreatePriceListRules extends Record<string, string[]> {}

/**
 * @interface
 *
 * The price list to create.
 */
export interface CreatePriceListDTO {
  /**
   * The price list's title.
   */
  title: string
  /**
   * The price list's description.
   */
  description: string
  /**
   * The price list is enabled starting from this date.
   */
  starts_at?: string | null
  /**
   * The price list expires after this date.
   */
  ends_at?: string | null
  /**
   * The price list's status.
   */
  status?: PriceListStatus
  /**
   * The price list's type.
   */
  type?: PriceListType
  /**
   * The number of rules associated with the price list.
   */
  rules_count?: number
  /**
   * The rules to be created and associated with the price list.
   */
  rules?: CreatePriceListRules
  /**
   * The prices associated with the price list.
   */
  prices?: CreatePriceListPriceDTO[]
}

/**
 * @interface
 *
 * The attributes to update in a price list.
 */
export interface UpdatePriceListDTO {
  /**
   * The ID of the price list to update.
   */
  id: string
  /**
   * The price list's title.
   */
  title?: string
  /**
   * The price list's description.
   */
  description?: string
  /**
   * The price list is enabled starting from this date.
   */
  starts_at?: string | null
  /**
   * The price list expires after this date.
   */
  ends_at?: string | null
  /**
   * The price list's status.
   */
  status?: PriceListStatus
  /**
   * The number of rules associated with the price list.
   */
  rules_count?: number
  /**
   * The rules to be created and associated with the price list.
   */
  rules?: CreatePriceListRules
}

/**
 * @interface
 *
 * Filters to apply on price lists.
 */
export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  /**
   * Find price lists by title or description through this search term.
   */
  q?: string
  /**
   * The IDs to filter price lists by
   */
  id?: string | string[]
  /**
   * The start dates to filter price lists by.
   */
  starts_at?: OperatorMap<string>
  /**
   * The end dates to filter price lists by.
   */
  ends_at?: OperatorMap<string>
  /**
   * The statuses to filter price lists by.
   */
  status?: PriceListStatus[]
  /**
   * The number of rules to filter price lists by.
   */
  rules_count?: number[]
}

/**
 * @interface
 *
 * Filters to apply on price list rules.
 */
export interface FilterablePriceListRuleProps
  extends BaseFilterable<FilterablePriceListRuleProps> {
  /**
   * The IDs to filter price list rules by.
   */
  id?: string[]
  /**
   * The values to filter price list rules by.
   */
  value?: string[]
  /**
   * Filter price list rules by the ID of their associated rule types.
   */
  rule_type?: string[]
  /**
   * Filter price list rules by the ID of their associated price lists.
   */
  price_list_id?: string[]
}

export interface FilterablePriceListRuleValueProps
  extends BaseFilterable<FilterablePriceListRuleValueProps> {
  id?: string[]
  value?: string[]
  price_list_rule_id?: string[]
}

/**
 * @interface
 *
 * The price list rule's details.
 */
export interface PriceListRuleDTO {
  /**
   * The price list rule's ID.
   */
  id: string
  /**
   * The value of the rule.
   *
   * @privateRemarks
   * Shouldn't this be in PriceListRuleValueDTO only?
   */
  value: string
  /**
   * The associated rule type.
   *
   * @expandable
   */
  rule_type: RuleTypeDTO
  /**
   * The associated price list.
   *
   * @expandable
   */
  price_list: PriceListDTO
  /**
   * The associated rule values.
   *
   * @expandable
   */
  price_list_rule_values?: PriceListRuleValueDTO[]
}

/**
 * @interface
 *
 * The price list rule to create.
 */
export interface CreatePriceListRuleDTO {
  /**
   * The ID of a rule type to be associated with the price list rule.
   */
  rule_type_id?: string
  /**
   * The ID of a rule type or the details of an existing rule type to be associated with the price list rule.
   */
  rule_type?: string | RuleTypeDTO
  /**
   * The ID of a price list to be associated with the price list rule.
   */
  price_list_id?: string
  /**
   * The ID of a price list or the details of an existing price list to be associated with the price list rule.
   */
  price_list?: string | PriceListDTO
}

/**
 * @interface
 *
 * The attributes to update in a price list rule.
 */
export interface UpdatePriceListRuleDTO {
  /**
   * The ID of the price list rule to update.
   */
  id: string
  /**
   * The ID of a price list to be associated with the price list rule.
   */
  price_list_id?: string
  /**
   * The ID of a rule type to be associated with the price list rule.
   */
  rule_type_id?: string
  /**
   * The ID of a price list to be associated with the price list rule.
   */
  price_list?: string
  /**
   * The ID of a rule type or the details of an existing rule type to be associated with the price list rule.
   */
  rule_type?: string
}

/**
 * @interface
 *
 * The price list rule value's details.
 */
export interface PriceListRuleValueDTO {
  /**
   * The price list rule value's ID.
   */
  id: string
  /**
   * The rule's value.
   */
  value: string
  /**
   * The associated price list rule.
   *
   * @expandable
   */
  price_list_rule: PriceListRuleDTO
}

export interface CreatePriceListRuleValueDTO {
  value: string
  price_list_rule_id?: string
  price_list_rule?: PriceListRuleDTO | string
}

export interface UpdatePriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule_id: string
}

/**
 * @interface
 *
 * The prices to be added to a price list.
 */
export interface AddPriceListPricesDTO {
  /**
   * The ID of the price list to add prices to.
   */
  price_list_id: string
  /**
   * The prices to add.
   */
  prices: CreatePriceListPriceDTO[]
}

/**
 * @interface
 *
 * The prices to be added to a price list.
 */
export interface UpdatePriceListPricesDTO {
  /**
   * The ID of the price list to add prices to.
   */
  price_list_id: string
  /**
   * The prices to add.
   */
  prices: UpdatePriceListPriceDTO[]
}

/**
 * @interface
 *
 * The rules to set in a price list.
 */
export interface SetPriceListRulesDTO {
  /**
   * The ID of the price list to set its rules.
   */
  price_list_id: string
  /**
   * The rules to add to the price list. Each key of the object is a rule type's `rule_attribute`, and its value
   * is the value(s) of the rule.
   */
  rules: Record<string, string | string[]>
}

/**
 * @interface
 *
 * The rules to remove from a price list.
 */
export interface RemovePriceListRulesDTO {
  /**
   * The ID of the price list to remove rules from.
   */
  price_list_id: string
  /**
   * The rules to remove from the price list. Each item being a rule type's `rule_attribute`.
   */
  rules: string[]
}
