/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details to update of the payment collection.
 */
export interface AdminUpdatePaymentCollectionsReq {
  /**
   * A description to create or update the payment collection.
   */
  description?: string
  /**
   * A set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
