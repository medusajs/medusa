/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Address } from "./Address"
import type { CustomerGroup } from "./CustomerGroup"
import type { Order } from "./Order"

/**
 * Represents a customer
 */
export interface Customer {
  /**
   * The customer's ID
   */
  id: string
  /**
   * The customer's email
   */
  email: string
  /**
   * The customer's first name
   */
  first_name: string | null
  /**
   * The customer's last name
   */
  last_name: string | null
  /**
   * The customer's billing address ID
   */
  billing_address_id: string | null
  /**
   * Available if the relation `billing_address` is expanded.
   */
  billing_address?: Address | null
  /**
   * Available if the relation `shipping_addresses` is expanded.
   */
  shipping_addresses?: Array<Address>
  /**
   * The customer's phone number
   */
  phone: string | null
  /**
   * Whether the customer has an account or not
   */
  has_account: boolean
  /**
   * Available if the relation `orders` is expanded.
   */
  orders?: Array<Order>
  /**
   * The customer groups the customer belongs to. Available if the relation `groups` is expanded.
   */
  groups?: Array<CustomerGroup>
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
