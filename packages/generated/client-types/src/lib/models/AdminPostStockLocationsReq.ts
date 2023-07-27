/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationAddressInput } from "./StockLocationAddressInput"

export interface AdminPostStockLocationsReq {
  /**
   * the name of the stock location
   */
  name: string
  /**
   * the ID of an existing stock location address to associate with the stock location. Only required if `address` is not provided.
   */
  address_id?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  /**
   * A new stock location address to create and associate with the stock location. Only required if `address_id` is not provided.
   */
  address?: StockLocationAddressInput
}
