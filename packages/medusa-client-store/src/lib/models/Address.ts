/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An address.
 */
export type Address = {
  /**
   * ID of the address
   */
  id?: string;
  /**
   * ID of the customer this address belongs to
   */
  customer_id?: string;
  /**
   * Available if the relation `customer` is expanded.
   */
  customer?: Array<Record<string, any>>;
  /**
   * Company name
   */
  company?: string;
  /**
   * First name
   */
  first_name?: string;
  /**
   * Last name
   */
  last_name?: string;
  /**
   * Address line 1
   */
  address_1?: string;
  /**
   * Address line 2
   */
  address_2?: string;
  /**
   * City
   */
  city?: string;
  /**
   * The 2 character ISO code of the country in lower case
   */
  country_code?: string;
  /**
   * A country object. Available if the relation `country` is expanded.
   */
  country?: Record<string, any>;
  /**
   * Province
   */
  province?: string;
  /**
   * Postal Code
   */
  postal_code?: string;
  /**
   * Phone Number
   */
  phone?: string;
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

