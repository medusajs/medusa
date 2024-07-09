export interface BaseCalculatedPriceSet {
  /**
   * The ID of the price set.
   */
  id: string

  /**
   * Whether the calculated price is associated with a price list. During the calculation process, if no valid price list is found,
   * the calculated price is set to the original price, which doesn't belong to a price list. In that case, the value of this property is `false`.
   */
  is_calculated_price_price_list?: boolean

  /**
   * Whether the calculated price is tax inclusive.
   */
  is_calculated_price_tax_inclusive?: boolean

  /**
   * The amount of the calculated price, or `null` if there isn't a calculated price.
   */
  calculated_amount: number | null

  /**
   * The amount of the calculated price with taxes included. If the calculated price is tax inclusive, this field will be the same as `calculated_amount`.
   */
  calculated_amount_with_tax?: number | null

  /**
   * The amount of the calculated price without taxes included. If the calculated price is tax exclusive, this field will be the same as `calculated_amount`.
   */
  calculated_amount_without_tax?: number | null

  /**
   * Whether the original price is associated with a price list. During the calculation process, if the price list of the calculated price is of type override,
   * the original price will be the same as the calculated price. In that case, the value of this property is `true`.
   */
  is_original_price_price_list?: boolean

  /**
   * Whether the original price is tax inclusive.
   */
  is_original_price_tax_inclusive?: boolean

  /**
   * The amount of the original price, or `null` if there isn't a calculated price.
   */
  original_amount: number | null

  /**
   * The currency code of the calculated price, or null if there isn't a calculated price.
   */
  currency_code: string | null

  /**
   * The details of the calculated price.
   */
  calculated_price?: {
    /**
     * The ID of the price selected as the calculated price.
     */
    id: string | null
    /**
     * The ID of the associated price list, if any.
     */
    price_list_id: string | null
    /**
     * The type of the associated price list, if any.
     */
    price_list_type: string | null
    /**
     * The `min_quantity` field defined on a price.
     */
    min_quantity: number | null
    /**
     * The `max_quantity` field defined on a price.
     */
    max_quantity: number | null
  }

  /**
   * The details of the original price.
   */
  original_price?: {
    /**
     * The ID of the price selected as the original price.
     */
    id: string | null
    /**
     * The ID of the associated price list, if any.
     */
    price_list_id: string | null
    /**
     * The type of the associated price list, if any.
     */
    price_list_type: string | null
    /**
     * The `min_quantity` field defined on a price.
     */
    min_quantity: number | null
    /**
     * The `max_quantity` field defined on a price.
     */
    max_quantity: number | null
  }
}
