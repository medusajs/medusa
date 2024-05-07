/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetOrdersParams {
  /**
   * Filter by ID.
   */
  display_id: number
  /**
   * Comma-separated fields that should be expanded in the returned order.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in the returned order.
   */
  expand?: string
  /**
   * Filter by email.
   */
  email: string
  /**
   * Filter by the shipping address's postal code.
   */
  shipping_address?: {
    /**
     * The postal code of the shipping address
     */
    postal_code?: string
  }
}
