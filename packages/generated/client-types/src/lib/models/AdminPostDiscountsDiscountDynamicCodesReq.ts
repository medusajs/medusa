/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the dynamic discount to create.
 */
export interface AdminPostDiscountsDiscountDynamicCodesReq {
  /**
   * A unique code that will be used to redeem the Discount
   */
  code: string
  /**
   * Maximum number of times the discount code can be used
   */
  usage_limit?: number
  /**
   * Maximum number of times the discount code can be used per customer
   */
  usage_limit_per_customer?: number
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
