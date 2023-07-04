/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostStoreReq {
  /**
   * The name of the Store
   */
  name?: string
  /**
   * A template for Swap links - use `{{cart_id}}` to insert the Swap Cart id
   */
  swap_link_template?: string
  /**
   * A template for payment links links - use `{{cart_id}}` to insert the Cart id
   */
  payment_link_template?: string
  /**
   * A template for invite links - use `{{invite_token}}` to insert the invite token
   */
  invite_link_template?: string
  /**
   * The default currency code for the Store.
   */
  default_currency_code?: string
  /**
   * Array of currencies in 2 character ISO code format.
   */
  currencies?: Array<string>
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
