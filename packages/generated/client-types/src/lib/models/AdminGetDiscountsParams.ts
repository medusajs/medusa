/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetDiscountsParams {
  /**
   * term to search discounts' code field.
   */
  q?: string
  /**
   * Filter discounts by rule fields.
   */
  rule?: {
    /**
     * Filter discounts by type.
     */
    type?: "fixed" | "percentage" | "free_shipping"
    /**
     * Filter discounts by allocation type.
     */
    allocation?: "total" | "item"
  }
  /**
   * Filter discounts by whether they're dynamic or not.
   */
  is_dynamic?: boolean
  /**
   * Filter discounts by whether they're disabled or not.
   */
  is_disabled?: boolean
  /**
   * The number of discounts to return
   */
  limit?: number
  /**
   * The number of discounts to skip when retrieving the discounts.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in each returned discount.
   */
  expand?: string
}
