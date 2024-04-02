import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * A money amount's data. A money amount represents a price.
 */
export interface MoneyAmountDTO {
  /**
   * The ID of the money amount.
   */
  id: string
  /**
   * The currency code of this money amount.
   */
  currency_code?: string
  /**
   * The price of this money amount.
   */
  amount?: number
  /**
   * The minimum quantity required to be purchased for this price to be applied.
   */
  min_quantity?: number
  /**
   * The maximum quantity required to be purchased for this price to be applied.
   */
  max_quantity?: number
  /**
   * When the money_amount was created.
   */
  created_at: Date
  /**
   * When the money_amount was updated.
   */
  updated_at: Date
  /**
   * When the money_amount was deleted.
   */
  deleted_at: null | Date
}

/**
 * @interface
 *
 * The money amount to create.
 */
export interface CreateMoneyAmountDTO {
  /**
   * The ID of the money amount.
   */
  id?: string
  /**
   * The currency code of this money amount.
   */
  currency_code: string
  /**
   * The amount of this money amount.
   */
  amount: number
  /**
   * The minimum quantity required to be purchased for this money amount to be applied.
   */
  min_quantity?: number | null
  /**
   * The maximum quantity required to be purchased for this money amount to be applied.
   */
  max_quantity?: number | null
}

/**
 * @interface
 *
 * The data to update in a money amount. The `id` is used to identify which money amount to update.
 */
export interface UpdateMoneyAmountDTO {
  /**
   * The ID of the money amount to update.
   */
  id: string
  /**
   * The code of the currency to associate with the money amount.
   */
  currency_code?: string | null
  /**
   * The price of this money amount.
   */
  amount?: number
  /**
   * The minimum quantity required to be purchased for this money amount to be applied.
   */
  min_quantity?: number
  /**
   * The maximum quantity required to be purchased for this money amount to be applied.
   */
  max_quantity?: number
}

/**
 * @interface
 *
 * Filters to apply on a money amount.
 */
export interface FilterableMoneyAmountProps
  extends BaseFilterable<FilterableMoneyAmountProps> {
  /**
   * IDs to filter money amounts by.
   */
  id?: string[]
  /**
   * Currency codes to filter money amounts by.
   */
  currency_code?: string | string[]
}
