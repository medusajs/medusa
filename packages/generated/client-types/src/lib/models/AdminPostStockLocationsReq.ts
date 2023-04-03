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
   * the stock location address ID
   */
  address_id?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  address?: StockLocationAddressInput
}
