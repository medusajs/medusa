/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"
import type { SalesChannel } from "./SalesChannel"

/**
 * A store holds the main settings of the commerce shop. By default, only one store is created and used within the Medusa backend. It holds settings related to the name of the store, available currencies, and more.
 */
export interface Store {
  /**
   * The store's ID
   */
  id: string
  /**
   * The name of the Store - this may be displayed to the Customer.
   */
  name: string
  /**
   * The three character currency code that is the default of the store.
   */
  default_currency_code: string
  /**
   * The details of the store's default currency.
   */
  default_currency?: Currency | null
  /**
   * The details of the enabled currencies in the store.
   */
  currencies?: Array<Currency>
  /**
   * A template to generate Swap links from. Use {{cart_id}} to include the Swap's `cart_id` in the link.
   */
  swap_link_template: string | null
  /**
   * A template to generate Payment links from. Use {{cart_id}} to include the payment's `cart_id` in the link.
   */
  payment_link_template: string | null
  /**
   * A template to generate Invite links from
   */
  invite_link_template: string | null
  /**
   * The location ID the store is associated with.
   */
  default_location_id: string | null
  /**
   * The ID of the store's default sales channel.
   */
  default_sales_channel_id?: string | null
  /**
   * The details of the store's default sales channel.
   */
  default_sales_channel?: SalesChannel | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
