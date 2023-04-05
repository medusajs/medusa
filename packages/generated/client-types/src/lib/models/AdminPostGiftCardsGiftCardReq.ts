/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostGiftCardsGiftCardReq {
  /**
   * The value (excluding VAT) that the Gift Card should represent.
   */
  balance?: number
  /**
   * Whether the Gift Card is disabled on creation. You will have to enable it later to make it available to Customers.
   */
  is_disabled?: boolean
  /**
   * The time at which the Gift Card should no longer be available.
   */
  ends_at?: string
  /**
   * The ID of the Region in which the Gift Card can be used.
   */
  region_id?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
