import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"

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
   * The attribute of the price rule
   */
  attribute: string
  /**
   * The value of the price rule.
   */
  value: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority: number
  /**
   * The ID of the associated price.
   */
  price_id: string
  /**
   * The ID of the associated price list.
   */
  price_list_id: string
  /**
   * When the price_rule was created.
   */
  created_at: Date
  /**
   * When the price_rule was updated.
   */
  updated_at: Date
  /**
   * When the price_rule was deleted.
   */
  deleted_at: null | Date
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
   * The attribute of the price rule
   */
  attribute: string
  /**
   * The value of the price rule.
   */
  value: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority?: number
  /**
   * The ID of the associated price.
   */
  price_id?: string
}

/**
 *
 * @interface
 *
 * The data to update in a price rule. The `id` is used to identify which price rule to update.
 */
export interface UpdatePriceRuleDTO {
  id: string
  price_set_id?: string
  /**
   * The attribute of the price rule
   */
  attribute?: string
  /**
   * The value of the price rule.
   */
  value?: string
  /**
   * The priority of the price rule in comparison to other applicable price rules.
   */
  priority?: number
  /**
   * The ID of the associated price.
   */
  price_id?: string
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
}
