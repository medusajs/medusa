/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationAddressInput } from "./StockLocationAddressInput"

/**
 * Represents the Input to create a Stock Location
 */
export interface CreateStockLocationInput {
  /**
   * The stock location name
   */
  name: string
  /**
   * The Stock location address ID
   */
  address_id?: string
  /**
   * Stock location address object
   */
  address?: StockLocationAddressInput & Record<string, any>
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
}
