/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a Stock Location Address Input
 */
export interface StockLocationAddressInput {
  /**
   * Stock location address
   */
  address_1: string
  /**
   * Stock location address' complement
   */
  address_2?: string
  /**
   * Stock location address' city
   */
  city?: string
  /**
   * Stock location address' country
   */
  country_code: string
  /**
   * Stock location address' phone number
   */
  phone?: string
  /**
   * Stock location address' postal code
   */
  postal_code?: string
  /**
   * Stock location address' province
   */
  province?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
}
