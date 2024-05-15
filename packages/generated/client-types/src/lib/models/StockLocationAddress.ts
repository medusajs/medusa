/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The stock location's address.
 */
export interface StockLocationAddress {
  /**
   * The address's address 1.
   */
  address_1: string
  /**
   * The address's address 2.
   */
  address_2?: string
  /**
   * The address's company.
   */
  company?: string
  /**
   * The address's city.
   */
  city?: string
  /**
   * The address's country code.
   */
  country_code: string
  /**
   * The address's phone.
   */
  phone?: string
  /**
   * The address's postal code.
   */
  postal_code?: string
  /**
   * The address's province.
   */
  province?: string
}
