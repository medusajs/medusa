/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetDiscountsParams {
  /**
   * Search query applied on the code field.
   */
  q?: string
  /**
   * Discount Rules filters to apply on the search
   */
  rule?: {
    /**
     * The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
     */
    type?: "fixed" | "percentage" | "free_shipping"
    /**
     * The value that the discount represents; this will depend on the type of the discount
     */
    allocation?: "total" | "item"
  }
  /**
   * Return only dynamic discounts.
   */
  is_dynamic?: boolean
  /**
   * Return only disabled discounts.
   */
  is_disabled?: boolean
  /**
   * The number of items in the response
   */
  limit?: number
  /**
   * The offset of items in response
   */
  offset?: number
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string
}
