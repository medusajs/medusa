/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';
import type { PriceList } from './PriceList';

/**
 * Money Amounts represents an amount that a given Product Variant can be purcased for. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used the amount will be in the currency defined for the Reigon.
 */
export type MoneyAmount = {
  /**
   * The money amount's ID
   */
  id?: string;
  /**
   * The 3 character currency code that the Money Amount is given in.
   */
  currency_code: string;
  /**
   * Available if the relation `currency` is expanded.
   */
  currency?: Currency;
  /**
   * The amount in the smallest currecny unit (e.g. cents 100 cents to charge $1) that the Product Variant will cost.
   */
  amount: number;
  /**
   * The minimum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.
   */
  min_quantity?: number;
  /**
   * The maximum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.
   */
  max_quantity?: number;
  /**
   * The ID of the price list associated with the money amount
   */
  price_list_id?: string;
  /**
   * Available if the relation `price_list` is expanded.
   */
  price_list?: PriceList;
  /**
   * The id of the Product Variant contained in the Line Item.
   */
  variant_id?: string;
  /**
   * The Product Variant contained in the Line Item. Available if the relation `variant` is expanded.
   */
  variant?: Record<string, any>;
  /**
   * The region's ID
   */
  region_id?: string;
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Record<string, any>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

