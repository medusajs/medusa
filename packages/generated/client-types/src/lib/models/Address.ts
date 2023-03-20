/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Country } from "./Country"
import type { Customer } from "./Customer"

/**
 * An address.
 */
export interface Address {
  /**
   * ID of the address
   */
  id: string
  /**
   * ID of the customer this address belongs to
   */
  customer_id: string | null
  /**
   * Available if the relation `customer` is expanded.
   */
  customer?: Customer | null
  /**
   * Company name
   */
  company: string | null
  /**
   * First name
   */
  first_name: string | null
  /**
   * Last name
   */
  last_name: string | null
  /**
   * Address line 1
   */
  address_1: string | null
  /**
   * Address line 2
   */
  address_2: string | null
  /**
   * City
   */
  city: string | null
  /**
   * The 2 character ISO code of the country in lower case
   */
  country_code: string | null
  /**
   * A country object. Available if the relation `country` is expanded.
   */
  country?: Country | null
  /**
   * Province
   */
  province: string | null
  /**
   * Postal Code
   */
  postal_code: string | null
  /**
   * Phone Number
   */
  phone: string | null
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
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
