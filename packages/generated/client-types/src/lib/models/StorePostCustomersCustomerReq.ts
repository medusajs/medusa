/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface StorePostCustomersCustomerReq {
  /**
   * The customer's first name.
   */
  first_name?: string
  /**
   * The customer's last name.
   */
  last_name?: string
  /**
   * The address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The customer's password.
   */
  password?: string
  /**
   * The customer's phone number.
   */
  phone?: string
  /**
   * The customer's email.
   */
  email?: string
  /**
   * Additional custom data about the customer.
   */
  metadata?: Record<string, any>
}
