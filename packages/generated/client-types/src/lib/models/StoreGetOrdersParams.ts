/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetOrdersParams {
  /**
   * The display id given to the Order.
   */
  display_id: number
  /**
   * (Comma separated) Which fields should be included in the result.
   */
  fields?: string
  /**
   * (Comma separated) Which fields should be expanded in the result.
   */
  expand?: string
  /**
   * The email associated with this order.
   */
  email: string
  /**
   * The shipping address associated with this order.
   */
  shipping_address?: {
    /**
     * The postal code of the shipping address
     */
    postal_code?: string
  }
}
