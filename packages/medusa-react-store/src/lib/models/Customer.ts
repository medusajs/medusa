/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { CustomerGroup } from './CustomerGroup';

/**
 * Represents a customer
 */
export type Customer = {
  /**
   * The customer's ID
   */
  id?: string;
  /**
   * The customer's email
   */
  email: string;
  /**
   * The customer's first name
   */
  first_name?: string;
  /**
   * The customer's last name
   */
  last_name?: string;
  /**
   * The customer's billing address ID
   */
  billing_address_id?: string;
  /**
   * Available if the relation `billing_address` is expanded.
   */
  billing_address?: Address;
  /**
   * Available if the relation `shipping_addresses` is expanded.
   */
  shipping_addresses?: Array<Address>;
  /**
   * The customer's phone number
   */
  phone?: string;
  /**
   * Whether the customer has an account or not
   */
  has_account?: boolean;
  /**
   * Available if the relation `orders` is expanded.
   */
  orders?: Array<Record<string, any>>;
  /**
   * The customer groups the customer belongs to. Available if the relation `groups` is expanded.
   */
  groups?: Array<CustomerGroup>;
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

