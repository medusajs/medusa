import { PricingRuleOperatorValues } from "../../../pricing"
import { BaseCalculatedPriceSet } from "../common"

export interface StorePrice {
  /**
   * The price's ID.
   */
  id: string
  /**
   * The price's currency code.
   *
   * @example
   * usd
   */
  currency_code: string
  /**
   * The price's amount.
   */
  amount: number
  /**
   * The minimum quantity that must be available in the cart for the price to be applied.
   */
  min_quantity: number | null
  /**
   * The maximum quantity allowed to be available in the cart for the price to be applied.
   */
  max_quantity: number | null

  /**
   * The rules enabled to enable the current price
   */
  price_rules?: StorePriceRule[]
}

export interface StorePriceRule {
  /**
   * The ID of the price rule.
   */
  id: string
  /**
   * The attribute of the price rule
   */
  attribute: string

  /**
   * The operator of the price rule
   */
  operator: PricingRuleOperatorValues

  /**
   * The value of the price rule.
   */
  value: string
}

export interface StoreCalculatedPrice extends BaseCalculatedPriceSet {}
