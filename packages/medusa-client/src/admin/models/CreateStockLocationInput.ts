/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StockLocationAddressInput } from './StockLocationAddressInput';

/**
 * Represents the Input to create a Stock Location
 */
export type CreateStockLocationInput = {
  /**
   * The stock location name
   */
  name: string;
  /**
   * The Stock location address ID
   */
  address_id?: string;
  /**
   * Stock location address object
   */
  address?: (StockLocationAddressInput & Record<string, any>);
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

