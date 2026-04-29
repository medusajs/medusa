/**
 * @privateRemarks
 * TODO: Not sure how to type this properly, as it's unclear to me what is returned
 * by our API. As an example we return `price_list: null` but `price_list_id` is missing.
 *
 * Type in model that aren't currently in this type:
 * - price_list_id
 * - price_list
 * - price_rules
 * - rules_count
 *
 * Also `raw_amount` is typed as `Record<string, unknown>` but it seems to always return:
 * ```ts
 * {
 *   amount: number
 *   precision: number
 * }
 * ```
 */
export interface AdminPrice {
  /**
   * The price's ID.
   */
  id: string
  /**
   * The price's title.
   */
  title: string
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
   * The price's raw amount.
   */
  raw_amount: Record<string, unknown>
  /**
   * The minimum quantity that must be available in the cart for the price to be applied.
   */
  min_quantity: number | null
  /**
   * The maximum quantity allowed to be available in the cart for the price to be applied.
   */
  max_quantity: number | null
  /**
   * The ID of the price set this price belongs to.
   */
  price_set_id: string
  /**
   * The date the price was created.
   */
  created_at: string
  /**
   * The date the price was updated.
   */
  updated_at: string
  /**
   * The date the price was deleted.
   */
  deleted_at: string | null
}

export interface AdminPricePreference {
  /**
   * The price preference's ID.
   */
  id: string
  /**
   * The attribute that the price preference refers to.
   * 
   * Current supported values: `region_id` and `currency_code`.
   */
  attribute: string | null
  /**
   * The attribute's value. For example, if the `attribute` is `region_id`,
   * the value is a region's ID. Prices in that region use this price
   * preference.
   */
  value: string | null
  /**
   * Whether prices matching this price preference have
   * taxes included in their amount.
   */
  is_tax_inclusive: boolean
  /**
   * The date that the price preference was created.
   */
  created_at: string
  /**
   * The date that the price preference was updated.
   */
  updated_at: string
  /**
   * The date that the price preference was deleted.
   */
  deleted_at: null | string
}
