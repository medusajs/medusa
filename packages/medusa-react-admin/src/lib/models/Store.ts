/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';

/**
 * Holds settings for the Store, such as name, currencies, etc.
 */
export type Store = {
  /**
   * The store's ID
   */
  id?: string;
  /**
   * The name of the Store - this may be displayed to the Customer.
   */
  name?: string;
  /**
   * The 3 character currency code that is the default of the store.
   */
  default_currency_code?: string;
  /**
   * Available if the relation `default_currency` is expanded.
   */
  default_currency?: Currency;
  /**
   * The currencies that are enabled for the Store. Available if the relation `currencies` is expanded.
   */
  currencies?: Array<Currency>;
  /**
   * A template to generate Swap links from. Use {{cart_id}} to include the Swap's `cart_id` in the link.
   */
  swap_link_template?: string;
  /**
   * A template to generate Payment links from. Use {{cart_id}} to include the payment's `cart_id` in the link.
   */
  payment_link_template?: string;
  /**
   * A template to generate Invite links from
   */
  invite_link_template?: string;
  /**
   * The sales channel ID the cart is associated with.
   */
  default_sales_channel_id?: string;
  /**
   * A sales channel object. Available if the relation `default_sales_channel` is expanded.
   */
  default_sales_channel?: Record<string, any>;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

