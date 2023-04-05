/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface StorePostCustomersCustomerReq {
  /**
   * The Customer's first name.
   */
  first_name?: string
  /**
   * The Customer's last name.
   */
  last_name?: string
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The Customer's password.
   */
  password?: string
  /**
   * The Customer's phone number.
   */
  phone?: string
  /**
   * The email of the customer.
   */
  email?: string
  /**
   * Metadata about the customer.
   */
  metadata?: Record<string, any>
}
