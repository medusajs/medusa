/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PriceList } from './PriceList';

/**
 * Represents a customer group
 */
export type CustomerGroup = {
  /**
   * The customer group's ID
   */
  id?: string;
  /**
   * The name of the customer group
   */
  name: string;
  /**
   * The customers that belong to the customer group. Available if the relation `customers` is expanded.
   */
  customers?: Array<Record<string, any>>;
  /**
   * The price lists that are associated with the customer group. Available if the relation `price_lists` is expanded.
   */
  price_lists?: Array<PriceList>;
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

