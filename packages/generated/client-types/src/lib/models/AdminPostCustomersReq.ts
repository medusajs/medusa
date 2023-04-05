/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostCustomersReq {
  /**
   * The customer's email.
   */
  email: string
  /**
   * The customer's first name.
   */
  first_name: string
  /**
   * The customer's last name.
   */
  last_name: string
  /**
   * The customer's password.
   */
  password: string
  /**
   * The customer's phone number.
   */
  phone?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
