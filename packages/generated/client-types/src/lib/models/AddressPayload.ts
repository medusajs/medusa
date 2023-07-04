/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Address fields used when creating/updating an address.
 */
export interface AddressPayload {
  /**
   * First name
   */
  first_name?: string
  /**
   * Last name
   */
  last_name?: string
  /**
   * Phone Number
   */
  phone?: string
  company?: string
  /**
   * Address line 1
   */
  address_1?: string
  /**
   * Address line 2
   */
  address_2?: string
  /**
   * City
   */
  city?: string
  /**
   * The 2 character ISO code of the country in lower case
   */
  country_code?: string
  /**
   * Province
   */
  province?: string
  /**
   * Postal Code
   */
  postal_code?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
}
