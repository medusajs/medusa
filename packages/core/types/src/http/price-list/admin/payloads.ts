import { PriceListStatus, PriceListType } from "../../../pricing"

/**
 * The details of a price to create and add to a price list.
 */
export interface AdminCreatePriceListPrice {
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
   * The ID of the variant this price applies to.
   */
  variant_id: string
  /**
   * The minimum quantity that must be available in the cart for the price to be applied.
   */
  min_quantity?: number | null
  /**
   * The maximum quantity allowed to be available in the cart for the price to be applied.
   */
  max_quantity?: number | null
  /**
   * The price's rules.
   */
  rules?: Record<string, string>
}

/**
 * The details of a price list to create.
 */
export interface AdminCreatePriceList {
  /**
   * The price list's title.
   */
  title: string
  /**
   * The price list's description.
   */
  description: string
  /**
   * The price list's start date.
   */
  starts_at?: string | null
  /**
   * The price list's end date.
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
   * The price list's rules.
   */
  rules?: Record<string, string[]>
  /**
   * The price list's prices.
   */
  prices?: AdminCreatePriceListPrice[]
  /**
   * Holds custom data in key-value pairs.
   * @since 2.14.2
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details of a price list price to update.
 */
export interface AdminUpdatePriceListPrice {
  /**
   * The ID of the price to update.
   */
  id: string
  /**
   * The price's currency code.
   *
   * @example
   * usd
   */
  currency_code?: string
  /**
   * The price's amount.
   */
  amount?: number
  /**
   * The ID of the variant this price applies to.
   */
  variant_id: string
  /**
   * The minimum quantity that must be available in the cart for the price to be applied.
   */
  min_quantity?: number | null
  /**
   * The maximum quantity allowed to be available in the cart for the price to be applied.
   */
  max_quantity?: number | null
  /**
   * The price's rules.
   */
  rules?: Record<string, string>
}

/**
 * The details of a price list to update.
 */
export interface AdminUpdatePriceList {
  /**
   * The price list's title.
   */
  title?: string
  /**
   * The price list's description.
   */
  description?: string
  /**
   * The price list's start date.
   */
  starts_at?: string | null
  /**
   * The price list's end date.
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
   * The price list's rules.
   */
  rules?: Record<string, string[]>
  /**
   * Holds custom data in key-value pairs.
   * @since 2.14.2
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The price operations to perform in a batch operation.
 */
export interface AdminBatchPriceListPrice {
  /**
   * The prices to create and add to the price list.
   */
  create?: AdminCreatePriceListPrice[]
  /**
   * The prices to update in the price list.
   */
  update?: AdminUpdatePriceListPrice[]
  /**
   * The prices to delete from the price list.
   */
  delete?: string[]
}

/**
 * The details to link or unlink products from a price list.
 */
export interface AdminLinkPriceListProducts {
  /**
   * The IDs of products to remove from the price list.
   */
  remove?: string[]
}
