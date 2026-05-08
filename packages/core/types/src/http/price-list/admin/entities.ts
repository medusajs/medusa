import { PriceListStatus, PriceListType } from "../../../pricing"
import { AdminPrice } from "../../price-preference"

/**
 * A price list price returned in admin API responses.
 */
export interface AdminPriceListPrice extends AdminPrice {
  /**
   * The ID of the variant that this price is for.
   */
  variant_id: string
  /**
   * The price's rules.
   */
  rules: Record<string, unknown>
}

/**
 * A price list returned in admin API responses.
 */
export interface AdminPriceList {
  /**
   * The price list's ID.
   */
  id: string
  /**
   * The price list's title.
   */
  title: string
  /**
   * The price list's description.
   */
  description: string
  /**
   * The price list's rules.
   */
  rules: Record<string, any>
  /**
   * The price list's start date.
   */
  starts_at: string | null
  /**
   * The price list's end date.
   */
  ends_at: string | null
  /**
   * The price list's status.
   */
  status: PriceListStatus
  /**
   * The price list's type.
   */
  type: PriceListType
  /**
   * The price list's prices.
   */
  prices: AdminPriceListPrice[]
  /**
   * The date the price list was created.
   */
  created_at: string
  /**
   * The date the price list was updated.
   */
  updated_at: string
  /**
   * The date the price list was deleted.
   */
  deleted_at: string | null
  /**
   * Holds custom data in key-value pairs.
   * @since 2.14.2
   */
  metadata: Record<string, unknown> | null
}
