import { BaseFilterable } from "../../dal"
import { MoneyAmountDTO } from "./money-amount"
import { PriceListDTO } from "./price-list"
import { PriceRuleDTO } from "./price-rule"
import { PriceSetDTO } from "./price-set"

/**
 * @interface
 *
 * A price set money amount's data.
 */
export interface PriceSetMoneyAmountDTO {
  /**
   * The ID of a price set money amount.
   */
  id: string
  /**
   * The title of the price set money amount.
   */
  title?: string
  /**
   * The price set associated with the price set money amount.
   *
   * @expandable
   */
  price_set?: PriceSetDTO
  /**
   * The price list associated with the price set money amount.
   *
   * @expandable
   */
  price_list?: PriceListDTO
  /**
   * The ID of the associated price set.
   */
  price_set_id?: string
  /**
   * The price rules associated with the price set money amount.
   *
   * @expandable
   */
  price_rules?: PriceRuleDTO[]
  /**
   * The money amount associated with the price set money amount.
   *
   * @expandable
   */
  money_amount?: MoneyAmountDTO
}

export interface UpdatePriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  money_amount?: MoneyAmountDTO
}

export interface CreatePriceSetMoneyAmountDTO {
  title?: string
  price_set?: PriceSetDTO | string
  price_list?: PriceListDTO | string
  money_amount?: MoneyAmountDTO | string
  rules_count?: number
}

/**
 * @interface
 *
 * Filters to apply on price set money amounts.
 */
export interface FilterablePriceSetMoneyAmountProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountProps> {
  /**
   * The IDs to filter the price set money amounts by.
   */
  id?: string[]
  /**
   * The IDs to filter the price set money amount's associated price set.
   */
  price_set_id?: string[]
  /**
   * The IDs to filter the price set money amount's associated price list.
   */
  price_list_id?: string[]
}
