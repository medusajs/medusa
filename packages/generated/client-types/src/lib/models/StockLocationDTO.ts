/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationAddressDTO } from "./StockLocationAddressDTO"

/**
 * Represents a Stock Location
 */
export interface StockLocationDTO {
  /**
   * The stock location's ID
   */
  id: string
  /**
   * Stock location address' ID
   */
  address_id: string
  /**
   * The name of the stock location
   */
  name: string
  /**
   * The Address of the Stock Location
   */
  address?: StockLocationAddressDTO & Record<string, any>
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string
}
