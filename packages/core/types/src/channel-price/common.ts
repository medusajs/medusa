import { BaseFilterable } from "../dal"

export type PriceType = "retail" | "wholesale" | "supply"

/**
 * The channel price details.
 */
export interface ChannelPriceDTO {
  /**
   * The ID of the channel price.
   */
  id: string

  /**
   * The sales material ID.
   */
  sales_material_id: string

  /**
   * The shop ID.
   */
  shop_id?: string

  /**
   * The customer class ID.
   */
  customer_class_id?: string

  /**
   * The price type.
   */
  price_type: PriceType

  /**
   * The currency code.
   */
  currency_code?: string

  /**
   * The amount.
   */
  amount: number

  /**
   * The start date.
   */
  start_at?: string

  /**
   * The end date.
   */
  end_at?: string

  /**
   * The minimum quantity.
   */
  min_quantity?: number

  /**
   * The maximum quantity.
   */
  max_quantity?: number

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the channel price.
   */
  created_at: string

  /**
   * The updated at of the channel price.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved channel prices.
 */
export interface FilterableChannelPriceProps
  extends BaseFilterable<FilterableChannelPriceProps> {
  /**
   * Find channel prices by search term.
   */
  q?: string

  /**
   * The IDs to filter the channel prices by.
   */
  id?: string | string[]

  /**
   * Filter channel prices by their sales material IDs.
   */
  sales_material_id?: string | string[]

  /**
   * Filter channel prices by their shop IDs.
   */
  shop_id?: string | string[]

  /**
   * Filter channel prices by their customer class IDs.
   */
  customer_class_id?: string | string[]

  /**
   * Filter channel prices by their price types.
   */
  price_type?: PriceType | PriceType[]

  /**
   * Filter channel prices by their currency codes.
   */
  currency_code?: string | string[]
}
